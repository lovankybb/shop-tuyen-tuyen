package com.washinggod.tuyenshop.mapper;

import com.washinggod.tuyenshop.dto.request.ColorRequest;
import com.washinggod.tuyenshop.dto.response.ColorResponse;
import com.washinggod.tuyenshop.entity.Color;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ColorMapper {
    Color toColor(ColorRequest request);
    ColorResponse toColorResponse(Color color);
}
