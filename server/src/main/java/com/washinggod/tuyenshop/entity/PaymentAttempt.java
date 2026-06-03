package com.washinggod.tuyenshop.entity;

import com.washinggod.tuyenshop.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "payment_attempts")
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    Order order;

    BigDecimal amount;

    String currency;

    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus;

    String gatewayTxnId;

    Integer responseCode;

    String responseMessage;

    String redirectUrl;

    String clientIpAddress;

    @Column(columnDefinition = "TEXT")
    String requestPayload;

    @Column(columnDefinition = "TEXT")
    String responsePayload;

    @CreationTimestamp
    Instant createdAt;

    @UpdateTimestamp
    Instant updatedAt;

    Instant paidAt;
}