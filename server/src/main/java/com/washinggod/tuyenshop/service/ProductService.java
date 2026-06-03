package com.washinggod.tuyenshop.service;

import com.washinggod.tuyenshop.dto.request.ProductCreationRequest;
import com.washinggod.tuyenshop.dto.request.ProductStatusUpdateRequest;
import com.washinggod.tuyenshop.dto.request.ProductUpdateRequest;
import com.washinggod.tuyenshop.dto.response.ProductResponse;
import com.washinggod.tuyenshop.dto.response.SliceResponse;
import com.washinggod.tuyenshop.entity.Brand;
import com.washinggod.tuyenshop.entity.Category;
import com.washinggod.tuyenshop.entity.Product;
import com.washinggod.tuyenshop.entity.ProductImage;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.mapper.ProductMapper;
import com.washinggod.tuyenshop.repository.BrandRepository;
import com.washinggod.tuyenshop.repository.CategoryRepository;
import com.washinggod.tuyenshop.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {


    ProductRepository productRepository;
    ProductMapper productMapper;
    BrandRepository brandRepository;
    CategoryRepository categoryRepository;

    public ProductResponse createProduct(ProductCreationRequest request) {
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Product product = productMapper.toProduct(request);
        product.setBrand(brand);
        product.setCategory(category);

        product = productRepository.save(product);
        return mapToProductResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
            product.setBrand(brand);
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            product.setCategory(category);
        }

        productMapper.updateProduct(product, request);
        product = productRepository.save(product);
        return mapToProductResponse(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductResponse changeProductStatus(Long id, ProductStatusUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        product.setStatus(request.getStatus());
        product = productRepository.save(product);

        return mapToProductResponse(product);
    }

    @Transactional(readOnly = true)
    public SliceResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String direction, Long categoryId, Long brandId, String keyword) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        // Spring Data JPA pages are 0-indexed, so we subtract 1 if the frontend sends 1-indexed pages
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        
        Slice<Product> productSlice = productRepository.filterProducts(categoryId, brandId, keyword, pageable);
        
        List<ProductResponse> productResponses = productSlice.getContent().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
                
        return SliceResponse.<ProductResponse>builder()
                .data(productResponses)
                .hasNext(productSlice.hasNext())
                .pageSize(productSlice.getSize())
                .build();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToProductResponse)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
    }

    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse response = productMapper.toProductResponse(product);
        if (product.getImages() != null) {
            response.setImages(product.getImages().stream()
                    .map(ProductImage::getUrl)
                    .collect(Collectors.toList()));
        }
        return response;
    }
}
