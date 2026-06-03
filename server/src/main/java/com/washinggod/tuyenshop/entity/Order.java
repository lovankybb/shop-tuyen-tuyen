package com.washinggod.tuyenshop.entity;

import com.washinggod.tuyenshop.enums.OrderStatus;
import com.washinggod.tuyenshop.enums.PaymentMethod;
import com.washinggod.tuyenshop.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "orders") // "order" is often a reserved word in SQL
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String orderCode;

    @Column(nullable = false)
    String customerName;

    @Column(nullable = false)
    String customerAddress;

    @Column(nullable = false)
    String customerPhone;

    String customerNote;

    BigDecimal subTotal;
    BigDecimal taxAmount;
    BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod;

    Instant paidAt;

    @CreationTimestamp
    Instant createdAt;

    @UpdateTimestamp
    Instant updatedAt;

    Instant canceledAt;

    String cancelReason;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderDetail> items;
}