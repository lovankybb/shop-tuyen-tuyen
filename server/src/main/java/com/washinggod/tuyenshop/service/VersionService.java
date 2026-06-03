package com.washinggod.tuyenshop.service;

import com.washinggod.tuyenshop.dto.request.VersionRequest;
import com.washinggod.tuyenshop.dto.response.VersionResponse;
import com.washinggod.tuyenshop.entity.Version;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.mapper.VersionMapper;
import com.washinggod.tuyenshop.repository.VersionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VersionService {
    VersionRepository versionRepository;
    VersionMapper versionMapper;

    public VersionResponse createVersion(VersionRequest request) {
        Version version = versionMapper.toVersion(request);
        version = versionRepository.save(version);
        return versionMapper.toVersionResponse(version);
    }

    public VersionResponse updateVersion(Long id, VersionRequest request) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND));
        version.setName(request.getName());
        version = versionRepository.save(version);
        return versionMapper.toVersionResponse(version);
    }

    public void deleteVersion(Long id) {
        versionRepository.deleteById(id);
    }

    public List<VersionResponse> getAllVersions() {
        return versionRepository.findAll().stream()
                .map(versionMapper::toVersionResponse)
                .collect(Collectors.toList());
    }

    public VersionResponse getVersionById(Long id) {
        return versionRepository.findById(id)
                .map(versionMapper::toVersionResponse)
                .orElseThrow(() -> new AppException(ErrorCode.VERSION_NOT_FOUND));
    }
}
