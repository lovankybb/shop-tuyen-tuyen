package com.washinggod.tuyenshop.controller;

import com.washinggod.tuyenshop.dto.request.ImageUrlRequest;
import com.washinggod.tuyenshop.dto.request.ProductCreationRequest;
import com.washinggod.tuyenshop.dto.request.ProductStatusUpdateRequest;
import com.washinggod.tuyenshop.dto.request.ProductUpdateRequest;
import com.washinggod.tuyenshop.dto.response.ApiResponse;
import com.washinggod.tuyenshop.dto.response.ProductResponse;
import com.washinggod.tuyenshop.dto.response.SliceResponse;
import com.washinggod.tuyenshop.service.ImageService;
import com.washinggod.tuyenshop.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;
    ImageService imageService;

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductCreationRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.createProduct(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductUpdateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProduct(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping
    public ApiResponse<SliceResponse<ProductResponse>> getAllProducts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "brandId", required = false) Long brandId,
            @RequestParam(value = "keyword", required = false) String keyword) {
        return ApiResponse.<SliceResponse<ProductResponse>>builder()
                .result(productService.getAllProducts(page, size, sortBy, direction, categoryId, brandId, keyword))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProductById(id))
                .build();
    }

    @PostMapping("/{id}/images")
    public ApiResponse<String> saveProductImageUrl(@PathVariable Long id, @Valid @RequestBody ImageUrlRequest request) {
        return ApiResponse.<String>builder()
                .result(imageService.saveProductImageUrl(id, request.getUrl()))
                .build();
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<ProductResponse> changeProductStatus(@PathVariable Long id, @Valid @RequestBody ProductStatusUpdateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.changeProductStatus(id, request))
                .build();
    }
}
