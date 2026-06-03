package com.washinggod.tuyenshop.mapper;

import com.washinggod.tuyenshop.dto.request.ProductCreationRequest;
import com.washinggod.tuyenshop.dto.request.ProductUpdateRequest;
import com.washinggod.tuyenshop.dto.response.ProductResponse;
import com.washinggod.tuyenshop.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {BrandMapper.class, CategoryMapper.class})
public interface ProductMapper {
    Product toProduct(ProductCreationRequest request);


    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    ProductResponse toProductResponse(Product product);
    void updateProduct(@MappingTarget Product product, ProductUpdateRequest request);

    default java.util.List<String> mapImages(java.util.List<com.washinggod.tuyenshop.entity.ProductImage> images) {
        if (images == null) return java.util.Collections.emptyList();
        return images.stream().map(com.washinggod.tuyenshop.entity.ProductImage::getUrl).collect(java.util.stream.Collectors.toList());
    }
}

