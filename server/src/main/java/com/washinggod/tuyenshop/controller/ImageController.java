package com.washinggod.tuyenshop.controller;

import com.washinggod.tuyenshop.dto.response.ApiResponse;
import com.washinggod.tuyenshop.service.ImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageController {
    ImageService imageService;

    @GetMapping("/signature")
    public ApiResponse<Map<String, Object>> generateSignature() {
        return ApiResponse.<Map<String, Object>>builder()
                .result(imageService.generateSignature())
                .build();
    }
}