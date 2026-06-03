package com.washinggod.tuyenshop.controller;

import com.washinggod.tuyenshop.dto.request.VersionRequest;
import com.washinggod.tuyenshop.dto.response.VersionResponse;
import com.washinggod.tuyenshop.service.VersionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/versions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VersionController {
    VersionService versionService;

    @PostMapping
    public VersionResponse createVersion(@Valid @RequestBody VersionRequest request) {
        return versionService.createVersion(request);
    }

    @PutMapping("/{id}")
    public VersionResponse updateVersion(@PathVariable Long id, @Valid @RequestBody VersionRequest request) {
        return versionService.updateVersion(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteVersion(@PathVariable Long id) {
        versionService.deleteVersion(id);
    }

    @GetMapping
    public List<VersionResponse> getAllVersions() {
        return versionService.getAllVersions();
    }

    @GetMapping("/{id}")
    public VersionResponse getVersionById(@PathVariable Long id) {
        return versionService.getVersionById(id);
    }
}
