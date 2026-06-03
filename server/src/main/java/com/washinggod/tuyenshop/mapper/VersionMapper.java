package com.washinggod.tuyenshop.mapper;

import com.washinggod.tuyenshop.dto.request.VersionRequest;
import com.washinggod.tuyenshop.dto.response.VersionResponse;
import com.washinggod.tuyenshop.entity.Version;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VersionMapper {
    Version toVersion(VersionRequest request);
    VersionResponse toVersionResponse(Version version);
}
