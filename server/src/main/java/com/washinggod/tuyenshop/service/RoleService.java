package com.washinggod.tuyenshop.service;

import com.washinggod.tuyenshop.dto.request.RoleRequest;
import com.washinggod.tuyenshop.dto.response.RoleResponse;
import com.washinggod.tuyenshop.entity.Permission;
import com.washinggod.tuyenshop.entity.Role;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.mapper.RoleMapper;
import com.washinggod.tuyenshop.repository.PermissionRepository;
import com.washinggod.tuyenshop.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    public RoleResponse create(RoleRequest request) {
        if (roleRepository.findByName(request.getName()).isPresent()) {
            throw new AppException(ErrorCode.ENTITY_EXISTED);
        }

        Role role = roleMapper.toRole(request);

        // Correctly look up permissions by their names
        if (request.getPermissions() != null) {
            var permissions = request.getPermissions().stream()
                    .map(name -> permissionRepository.findByName(name)
                            .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND)))
                    .collect(Collectors.toSet());
            role.setPermissions(permissions);
        }

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getAll() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponse)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        roleRepository.deleteById(id);
    }
}
