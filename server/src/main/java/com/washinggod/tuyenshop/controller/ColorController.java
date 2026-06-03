package com.washinggod.tuyenshop.controller;

import com.washinggod.tuyenshop.dto.request.ColorRequest;
import com.washinggod.tuyenshop.dto.response.ColorResponse;
import com.washinggod.tuyenshop.service.ColorService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/colors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ColorController {
    ColorService colorService;

    @PostMapping
    public ColorResponse createColor(@Valid @RequestBody ColorRequest request) {
        return colorService.createColor(request);
    }

    @PutMapping("/{id}")
    public ColorResponse updateColor(@PathVariable Long id, @Valid @RequestBody ColorRequest request) {
        return colorService.updateColor(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteColor(@PathVariable Long id) {
        colorService.deleteColor(id);
    }

    @GetMapping
    public List<ColorResponse> getAllColors() {
        return colorService.getAllColors();
    }

    @GetMapping("/{id}")
    public ColorResponse getColorById(@PathVariable Long id) {
        return colorService.getColorById(id);
    }
}
