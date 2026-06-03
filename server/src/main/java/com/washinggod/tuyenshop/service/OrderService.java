package com.washinggod.tuyenshop.service;

import com.washinggod.tuyenshop.dto.request.CartItemRequest;
import com.washinggod.tuyenshop.dto.request.OrderCreationRequest;
import com.washinggod.tuyenshop.dto.response.DashboardStatisticsResponse;
import com.washinggod.tuyenshop.dto.response.OrderDetailResponse;
import com.washinggod.tuyenshop.dto.response.OrderResponse;
import com.washinggod.tuyenshop.dto.response.PageResponse;
import com.washinggod.tuyenshop.entity.Order;
import com.washinggod.tuyenshop.entity.OrderDetail;
import com.washinggod.tuyenshop.entity.ProductVariant;
import com.washinggod.tuyenshop.enums.OrderStatus;
import com.washinggod.tuyenshop.enums.PaymentStatus;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.repository.OrderDetailRepository;
import com.washinggod.tuyenshop.repository.OrderRepository;
import com.washinggod.tuyenshop.repository.ProductVariantRepository;
import com.washinggod.tuyenshop.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {

    OrderRepository orderRepository;
    OrderDetailRepository orderDetailRepository;
    ProductVariantRepository productVariantRepository;
    UserRepository userRepository;
    CartService cartService;

    @Transactional
    public OrderResponse createOrder(OrderCreationRequest request) {
        BigDecimal subTotal = BigDecimal.ZERO;
        List<OrderDetail> orderDetails = new ArrayList<>();

        // 1. Initialize Order
        Order order = new Order();
        // Generate a random 8-character unique order code like "ORD-A1B2C3D4"
        order.setOrderCode("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerAddress(request.getCustomerAddress());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerNote(request.getCustomerNote());
        order.setPaymentMethod(request.getPaymentMethod());
        
        // Assuming your enums have PENDING defined for a brand new order
        order.setOrderStatus(OrderStatus.valueOf("PENDING"));
        order.setPaymentStatus(PaymentStatus.valueOf("PENDING"));
        order.setTaxAmount(BigDecimal.ZERO);

        // Link to currently authenticated user if present
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            userRepository.findByUsername(authentication.getName()).ifPresent(order::setUser);
        }

        // Save order first so we can map its primary key ID to OrderDetails
        order = orderRepository.save(order);

        // 2. Process Cart Items
        for (CartItemRequest itemReq : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemReq.getProductVariantId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

            if (variant.getStock() < itemReq.getQuantity()) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }

            // Decrease inventory stock
            variant.setStock(variant.getStock() - itemReq.getQuantity());
            productVariantRepository.save(variant);

            // Calculate price (Use variant price if present, fallback to base product price otherwise)
            BigDecimal itemPrice = variant.getPrice() != null ? variant.getPrice() : variant.getProduct().getPrice();
            BigDecimal totalItemPrice = itemPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subTotal = subTotal.add(totalItemPrice);

            // Create OrderDetail
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(variant);
            orderDetail.setPrice(itemPrice);
            orderDetail.setQuantity(itemReq.getQuantity());
            
            orderDetail = orderDetailRepository.save(orderDetail);
            orderDetails.add(orderDetail);
        }

        // 3. Update Order Totals
        order.setItems(orderDetails);
        order.setSubTotal(subTotal);
        order.setTotalAmount(subTotal.add(order.getTaxAmount()));
        order = orderRepository.save(order);

        // 4. Clear the cart if the user is authenticated
        if (order.getUser() != null) {
            cartService.clearCart();
        }

        // 5. Build and return Receipt
        return mapToOrderResponse(order);
    }

    public PageResponse<OrderResponse> getMyOrders(int page, int size, String sortBy, String direction) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String username = authentication.getName();
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Order> orderPage = orderRepository.findByUser_Username(username, pageable);

        List<OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());

        return PageResponse.<OrderResponse>builder()
                .currentPage(page)
                .totalPages(orderPage.getTotalPages())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .data(orderResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Order> orderPage = orderRepository.findAll(pageable);

        List<OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());

        return PageResponse.<OrderResponse>builder()
                .currentPage(page)
                .totalPages(orderPage.getTotalPages())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .data(orderResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(String identifier) {
        Order order;
        boolean isCodeLookup = false;
        
        try {
            Long id = Long.parseLong(identifier);
            order = orderRepository.findById(id)
                    .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
        } catch (NumberFormatException e) {
            order = orderRepository.findByOrderCode(identifier)
                    .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
            isCodeLookup = true;
        }

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("SCOPE_ADMIN"));

        // Enforce ownership if a non-admin user is trying to guess sequential IDs
        if (!isAdmin && !isCodeLookup) {
            if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            if (order.getUser() == null || !order.getUser().getUsername().equals(authentication.getName())) {
                throw new AppException(ErrorCode.ENTITY_NOT_FOUND); // Mask existence of the order
            }
        }

        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        order.setOrderStatus(newStatus);
        order = orderRepository.save(order);

        return mapToOrderResponse(order);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderDetailResponse> detailResponses = order.getItems() != null ? order.getItems().stream()
                .map(detail -> OrderDetailResponse.builder()
                        .id(detail.getId())
                        .productVariantId(detail.getProduct().getId())
                        .productName(detail.getProduct().getProduct().getName())
                        .colorName(detail.getProduct().getColor() != null ? detail.getProduct().getColor().getName() : null)
                        .versionName(detail.getProduct().getVersion() != null ? detail.getProduct().getVersion().getName() : null)
                        .price(detail.getPrice())
                        .quantity(detail.getQuantity())
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerName(order.getCustomerName())
                .customerAddress(order.getCustomerAddress())
                .customerPhone(order.getCustomerPhone())
                .customerNote(order.getCustomerNote())
                .subTotal(order.getSubTotal())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .items(detailResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardStatisticsResponse getDashboardStatistics() {
        return DashboardStatisticsResponse.builder()
                .totalOrders(orderRepository.count())
                .totalRevenue(orderRepository.calculateTotalRevenue(PaymentStatus.valueOf("PAID")))
                .build();
    }
}