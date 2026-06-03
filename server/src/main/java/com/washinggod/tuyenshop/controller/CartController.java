package com.washinggod.tuyenshop.controller;

import com.washinggod.tuyenshop.dto.request.CartItemRequest;
import com.washinggod.tuyenshop.dto.response.ApiResponse;
import com.washinggod.tuyenshop.dto.response.CartItemResponse;
import com.washinggod.tuyenshop.service.CartService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    
    CartService cartService;

    @GetMapping
    public ApiResponse<List<CartItemResponse>> getMyCart() {
        return ApiResponse.<List<CartItemResponse>>builder()
                .result(cartService.getMyCart())
                .build();
    }

    @PostMapping
    public ApiResponse<CartItemResponse> addToCart(@Valid @RequestBody CartItemRequest request) {
        return ApiResponse.<CartItemResponse>builder()
                .result(cartService.addToCart(request))
                .build();
    }

    @PutMapping("/{cartItemId}")
    public ApiResponse<CartItemResponse> updateQuantity(@PathVariable Long cartItemId, @RequestParam Integer quantity) {
        return ApiResponse.<CartItemResponse>builder()
                .result(cartService.updateQuantity(cartItemId, quantity))
                .build();
    }

    @DeleteMapping("/{cartItemId}")
    public ApiResponse<Void> removeCartItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ApiResponse.<Void>builder().build();
    }

    @DeleteMapping
    public ApiResponse<Void> clearCart() {
        cartService.clearCart();
        return ApiResponse.<Void>builder().build();
    }
}