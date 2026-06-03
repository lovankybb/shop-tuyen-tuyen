package com.washinggod.tuyenshop.mapper;

import com.washinggod.tuyenshop.dto.request.CategoryRequest;
import com.washinggod.tuyenshop.dto.response.CategoryResponse;
import com.washinggod.tuyenshop.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryRequest request);
    CategoryResponse toCategoryResponse(Category category);
}
