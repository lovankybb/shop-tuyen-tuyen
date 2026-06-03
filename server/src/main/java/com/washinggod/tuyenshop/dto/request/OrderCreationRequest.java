package com.washinggod.tuyenshop.dto.request;

import com.washinggod.tuyenshop.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCreationRequest {
    @NotEmpty(message = "Customer name is required")
    String customerName;

    @NotEmpty(message = "Customer address is required")
    String customerAddress;

    @NotEmpty(message = "Customer phone is required")
    String customerPhone;

    String customerNote;

    @NotNull(message = "Payment method is required")
    PaymentMethod paymentMethod;

    @NotEmpty(message = "Order must have at least one item")
    @Valid
    List<CartItemRequest> items;
}