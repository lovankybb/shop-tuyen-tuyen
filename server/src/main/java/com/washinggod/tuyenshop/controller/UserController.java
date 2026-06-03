package com.washinggod.tuyenshop.controller;

import com.washinggod.tuyenshop.dto.request.PasswordUpdateRequest;
import com.washinggod.tuyenshop.dto.request.UserCreationRequest;
import com.washinggod.tuyenshop.dto.request.UserRoleUpdateRequest;
import com.washinggod.tuyenshop.dto.request.UserUpdateRequest;
import com.washinggod.tuyenshop.dto.response.ApiResponse;
import com.washinggod.tuyenshop.dto.response.PageResponse;
import com.washinggod.tuyenshop.dto.response.UserResponse;
import com.washinggod.tuyenshop.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMyProfile() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyProfile())
                .build();
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> updateMyProfile(@Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateMyProfile(request))
                .build();
    }

    @PutMapping("/me/password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody PasswordUpdateRequest request) {
        userService.changePassword(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "username") String sortBy,
            @RequestParam(value = "direction", defaultValue = "asc") String direction) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .result(userService.getAllUsers(page, size, sortBy, direction))
                .build();
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<UserResponse> updateUserRole(@PathVariable Long id, @Valid @RequestBody UserRoleUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUserRole(id, request))
                .build();
    }
}