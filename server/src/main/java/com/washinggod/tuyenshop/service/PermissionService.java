package com.washinggod.tuyenshop.service;

import com.washinggod.tuyenshop.dto.request.PermissionRequest;
import com.washinggod.tuyenshop.dto.response.PermissionResponse;
import com.washinggod.tuyenshop.entity.Permission;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.mapper.PermissionMapper;
import com.washinggod.tuyenshop.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request) {
        if (permissionRepository.findByName(request.getName()).isPresent()) {
            throw new AppException(ErrorCode.ENTITY_EXISTED);
        }
        Permission permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    public List<PermissionResponse> getAll() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toPermissionResponse)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        permissionRepository.deleteById(id);
    }
}
