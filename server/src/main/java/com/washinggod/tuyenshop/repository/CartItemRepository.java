package com.washinggod.tuyenshop.repository;

import com.washinggod.tuyenshop.entity.CartItem;
import com.washinggod.tuyenshop.entity.ProductVariant;
import com.washinggod.tuyenshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProductVariant(User user, ProductVariant productVariant);
    void deleteByUser(User user);
}