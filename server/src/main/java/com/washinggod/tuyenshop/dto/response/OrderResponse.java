package com.washinggod.tuyenshop.dto.response;

import com.washinggod.tuyenshop.enums.OrderStatus;
import com.washinggod.tuyenshop.enums.PaymentMethod;
import com.washinggod.tuyenshop.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Long id;
    String orderCode;
    String customerName;
    String customerAddress;
    String customerPhone;
    String customerNote;
    BigDecimal subTotal;
    BigDecimal taxAmount;
    BigDecimal totalAmount;
    OrderStatus orderStatus;
    PaymentStatus paymentStatus;
    PaymentMethod paymentMethod;
    Instant createdAt;
    List<OrderDetailResponse> items;
}