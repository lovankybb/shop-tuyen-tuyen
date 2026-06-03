package com.washinggod.tuyenshop.mapper;

import com.washinggod.tuyenshop.dto.request.RoleRequest;
import com.washinggod.tuyenshop.dto.response.RoleResponse;
import com.washinggod.tuyenshop.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PermissionMapper.class})
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);
    RoleResponse toRoleResponse(Role role);
}
