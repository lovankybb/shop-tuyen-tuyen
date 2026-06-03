package com.washinggod.tuyenshop.service;

import com.washinggod.tuyenshop.dto.request.ColorRequest;
import com.washinggod.tuyenshop.dto.response.ColorResponse;
import com.washinggod.tuyenshop.entity.Color;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.mapper.ColorMapper;
import com.washinggod.tuyenshop.repository.ColorRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ColorService {
    ColorRepository colorRepository;
    ColorMapper colorMapper;

    public ColorResponse createColor(ColorRequest request) {
        Color color = colorMapper.toColor(request);
        color = colorRepository.save(color);
        return colorMapper.toColorResponse(color);
    }

    public ColorResponse updateColor(Long id, ColorRequest request) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
        color.setName(request.getName());
        color.setHex(request.getHex());
        color = colorRepository.save(color);
        return colorMapper.toColorResponse(color);
    }

    public void deleteColor(Long id) {
        colorRepository.deleteById(id);
    }

    public List<ColorResponse> getAllColors() {
        return colorRepository.findAll().stream()
                .map(colorMapper::toColorResponse)
                .collect(Collectors.toList());
    }

    public ColorResponse getColorById(Long id) {
        return colorRepository.findById(id)
                .map(colorMapper::toColorResponse)
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
    }
}
