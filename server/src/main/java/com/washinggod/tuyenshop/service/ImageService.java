package com.washinggod.tuyenshop.service;

import com.cloudinary.Cloudinary;
import com.washinggod.tuyenshop.entity.Product;
import com.washinggod.tuyenshop.entity.ProductImage;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.repository.ProductImageRepository;
import com.washinggod.tuyenshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class ImageService {

    private final Cloudinary cloudinary;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Value("${app.cloudinary.api-secret}")
    private String apiSecret;

    @Value("${app.cloudinary.api-key}")
    private String apiKey;

    @Value("${app.cloudinary.cloud-name}")
    private String cloudName;

    public ImageService(Cloudinary cloudinary, ProductRepository productRepository, ProductImageRepository productImageRepository) {
        this.cloudinary = cloudinary;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
    }

    public Map<String, Object> generateSignature() {
        long timestamp = System.currentTimeMillis() / 1000L;
        Map<String, Object> paramsToSign = new HashMap<>();
        paramsToSign.put("timestamp", timestamp);
        paramsToSign.put("folder", "products"); // Keeps your Cloudinary organized!

        // Generate the secure SHA-1 signature
        String signature = cloudinary.apiSignRequest(paramsToSign, apiSecret);

        Map<String, Object> response = new HashMap<>();
        response.put("signature", signature);
        response.put("timestamp", timestamp);
        response.put("folder", "products");
        response.put("apiKey", apiKey);
        response.put("cloudName", cloudName);
        return response;
    }

    @Transactional
    public String saveProductImageUrl(Long productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

        ProductImage productImage = new ProductImage();
        productImage.setProduct(product);
        productImage.setUrl(imageUrl);
        productImageRepository.save(productImage);

        return imageUrl;
    }
}