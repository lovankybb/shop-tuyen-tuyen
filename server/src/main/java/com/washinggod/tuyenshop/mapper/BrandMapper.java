package com.washinggod.tuyenshop.mapper;

import com.washinggod.tuyenshop.dto.request.BrandRequest;
import com.washinggod.tuyenshop.dto.response.BrandResponse;
import com.washinggod.tuyenshop.entity.Brand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    Brand toBrand(BrandRequest request);
    BrandResponse toBrandResponse(Brand brand);
}
