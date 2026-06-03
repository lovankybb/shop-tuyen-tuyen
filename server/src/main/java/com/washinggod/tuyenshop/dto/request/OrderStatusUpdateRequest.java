package com.washinggod.tuyenshop.dto.request;

import com.washinggod.tuyenshop.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderStatusUpdateRequest {
    @NotNull(message = "Order status is required")
    OrderStatus status;
}