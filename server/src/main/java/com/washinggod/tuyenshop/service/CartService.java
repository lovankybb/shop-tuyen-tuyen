package com.washinggod.tuyenshop.service;

import com.washinggod.tuyenshop.dto.request.CartItemRequest;
import com.washinggod.tuyenshop.dto.response.CartItemResponse;
import com.washinggod.tuyenshop.entity.CartItem;
import com.washinggod.tuyenshop.entity.ProductVariant;
import com.washinggod.tuyenshop.entity.User;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.repository.CartItemRepository;
import com.washinggod.tuyenshop.repository.ProductVariantRepository;
import com.washinggod.tuyenshop.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService {

    CartItemRepository cartItemRepository;
    ProductVariantRepository productVariantRepository;
    UserRepository userRepository;

    private User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public CartItemResponse addToCart(CartItemRequest request) {
        User user = getCurrentUser();
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

        if (variant.getStock() < request.getQuantity()) {
            throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
        }

        CartItem cartItem = cartItemRepository.findByUserAndProductVariant(user, variant)
                .orElse(new CartItem());

        if (cartItem.getId() == null) {
            cartItem.setUser(user);
            cartItem.setProductVariant(variant);
            cartItem.setQuantity(request.getQuantity());
        } else {
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            if (variant.getStock() < newQuantity) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }
            cartItem.setQuantity(newQuantity);
        }

        cartItem = cartItemRepository.save(cartItem);
        return mapToCartItemResponse(cartItem);
    }

    @Transactional
    public CartItemResponse updateQuantity(Long cartItemId, Integer quantity) {
        User user = getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        // Ensure users cannot update other users' cart items
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.ENTITY_NOT_FOUND);
        }

        if (quantity <= 0) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        if (cartItem.getProductVariant().getStock() < quantity) {
            throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
        }

        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);
        return mapToCartItemResponse(cartItem);
    }

    @Transactional
    public void removeCartItem(Long cartItemId) {
        User user = getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        if (cartItem.getUser().getId().equals(user.getId())) {
            cartItemRepository.delete(cartItem);
        }
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getMyCart() {
        User user = getCurrentUser();
        return cartItemRepository.findByUser(user).stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearCart() {
        User user = getCurrentUser();
        cartItemRepository.deleteByUser(user);
    }

    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        ProductVariant variant = cartItem.getProductVariant();
        BigDecimal price = variant.getPrice() != null ? variant.getPrice() : variant.getProduct().getPrice();

        return CartItemResponse.builder()
                .id(cartItem.getId())
                .productVariantId(variant.getId())
                .productName(variant.getProduct().getName())
                .colorName(variant.getColor() != null ? variant.getColor().getName() : null)
                .versionName(variant.getVersion() != null ? variant.getVersion().getName() : null)
                .price(price)
                .quantity(cartItem.getQuantity())
                .build();
    }
}