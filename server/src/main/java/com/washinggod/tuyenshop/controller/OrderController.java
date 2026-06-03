package com.washinggod.tuyenshop.controller;

import com.washinggod.tuyenshop.dto.request.OrderCreationRequest;
import com.washinggod.tuyenshop.dto.request.OrderStatusUpdateRequest;
import com.washinggod.tuyenshop.dto.response.DashboardStatisticsResponse;
import com.washinggod.tuyenshop.dto.response.ApiResponse;
import com.washinggod.tuyenshop.dto.response.PageResponse;
import com.washinggod.tuyenshop.dto.response.OrderResponse;
import com.washinggod.tuyenshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody OrderCreationRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.createOrder(request))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .result(orderService.getAllOrders(page, size, sortBy, direction))
                .build();
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<DashboardStatisticsResponse> getDashboardStatistics() {
        return ApiResponse.<DashboardStatisticsResponse>builder()
                .result(orderService.getDashboardStatistics())
                .build();
    }

    @GetMapping("/my-orders")
    public ApiResponse<PageResponse<OrderResponse>> getMyOrders(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction) {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .result(orderService.getMyOrders(page, size, sortBy, direction))
                .build();
    }

    @GetMapping("/{idOrCode}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable String idOrCode) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrder(idOrCode))
                .build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.updateOrderStatus(id, request.getStatus()))
                .build();
    }
}