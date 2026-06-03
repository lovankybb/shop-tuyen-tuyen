package com.washinggod.tuyenshop.mapper;

import com.washinggod.tuyenshop.dto.request.PermissionRequest;
import com.washinggod.tuyenshop.dto.response.PermissionResponse;
import com.washinggod.tuyenshop.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
}
