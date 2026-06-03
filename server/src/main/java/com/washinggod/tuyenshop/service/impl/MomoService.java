package com.washinggod.tuyenshop.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.washinggod.tuyenshop.configuration.properties.MomoProperties;
import com.washinggod.tuyenshop.entity.Order;
import com.washinggod.tuyenshop.entity.PaymentAttempt;
import com.washinggod.tuyenshop.enums.PaymentStatus;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.repository.OrderRepository;
import com.washinggod.tuyenshop.repository.PaymentAttemptRepository;
import com.washinggod.tuyenshop.service.PaymentService;
import com.washinggod.tuyenshop.util.SignatureService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MomoService implements PaymentService {

    @Autowired
    MomoProperties momoProperties;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    PaymentAttemptRepository paymentAttemptRepository;

    @Autowired
    SignatureService signatureService;

    @Autowired
    RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public String createPaymentUrl(String orderId, String amount, String orderInfo, String returnUrl, String notifyUrl) {
        try {
            log.info("Creating Momo payment URL for order: {}, amount: {}", orderId, amount);

            Order order = orderRepository.findById(Long.parseLong(orderId))
                    .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

            // Create request data
            Map<String, String> requestData = new LinkedHashMap<>();
            requestData.put("partnerCode", momoProperties.getPartnerCode());
            requestData.put("partnerName", "Tuyenshop");
            requestData.put("partnerTransId", orderId);
            requestData.put("customerId", orderId);
            requestData.put("customerName", order.getCustomerName());
            requestData.put("customerEmail", "");
            requestData.put("orderAmount", amount);
            requestData.put("orderId", orderId);
            requestData.put("orderInfo", orderInfo != null ? orderInfo : "Payment for order " + orderId);
            requestData.put("returnUrl", returnUrl != null ? returnUrl : momoProperties.getReturnUrl());
            requestData.put("notifyUrl", notifyUrl != null ? notifyUrl : momoProperties.getNotifyUrl());
            requestData.put("orderGroupId", "");
            requestData.put("autoCapture", "true");
            requestData.put("lang", "vi");

            // Generate request ID
            String requestId = UUID.randomUUID().toString();
            requestData.put("requestId", requestId);

            // Generate signature
            String rawSignature = "accessKey=" + momoProperties.getAccessKey() +
                    "&amount=" + amount +
                    "&extraData=&orderId=" + orderId +
                    "&orderInfo=" + (orderInfo != null ? orderInfo : "Payment for order " + orderId) +
                    "&partnerCode=" + momoProperties.getPartnerCode() +
                    "&partnerTransId=" + orderId +
                    "&requestId=" + requestId +
                    "&requestType=captureWallet&timestamp=" + System.currentTimeMillis();

            String signature = signatureService.hmacSHA256(momoProperties.getSecretKey(), rawSignature);
            requestData.put("signature", signature);
            requestData.put("requestType", "captureWallet");
            requestData.put("timestamp", String.valueOf(System.currentTimeMillis()));
            requestData.put("accessKey", momoProperties.getAccessKey());

            // Make HTTP request to Momo
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String requestBody = objectMapper.writeValueAsString(requestData);
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            log.info("Sending Momo request to: {}", momoProperties.getApiUrl());
            ResponseEntity<String> response = restTemplate.postForEntity(
                    momoProperties.getApiUrl(),
                    request,
                    String.class
            );

            // Parse response
            Map<String, Object> responseData = objectMapper.readValue(response.getBody(), Map.class);

            // Save payment attempt
            PaymentAttempt paymentAttempt = new PaymentAttempt();
            paymentAttempt.setOrder(order);
            paymentAttempt.setAmount(order.getTotalAmount());
            paymentAttempt.setCurrency("VND");
            paymentAttempt.setPaymentStatus(PaymentStatus.PENDING);
            paymentAttempt.setRequestPayload(requestBody);
            paymentAttempt.setResponsePayload(response.getBody());
            paymentAttempt.setGatewayTxnId(requestId);

            if (responseData.containsKey("pay")) {
                String payUrl = (String) responseData.get("pay");
                paymentAttempt.setRedirectUrl(payUrl);

                paymentAttemptRepository.save(paymentAttempt);
                log.info("Payment attempt saved with redirect URL: {}", payUrl);

                return payUrl;
            } else {
                log.error("Momo API response missing payment URL: {}", response.getBody());
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
            }

        } catch (Exception e) {
            log.error("Error creating Momo payment URL", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Override
    public boolean verifySignature(String signature, String data) {
        try {
            log.info("Verifying Momo signature");
            String expectedSignature = signatureService.hmacSHA256(momoProperties.getSecretKey(), data);
            boolean isValid = expectedSignature.equals(signature);
            log.info("Signature verification result: {}", isValid);
            return isValid;
        } catch (Exception e) {
            log.error("Error verifying Momo signature", e);
            return false;
        }
    }

    @Override
    @Transactional
    public Object ipnHandle(Map<String, String> params) {
        try {
            log.info("Handling Momo IPN notification");

            String partnerCode = params.get("partnerCode");
            String orderId = params.get("orderId");
            String requestId = params.get("requestId");
            String amount = params.get("amount");
            String signature = params.get("signature");
            String resultCode = params.get("resultCode");
            String message = params.get("message");
            String transId = params.get("transId");
            String responseTime = params.get("responseTime");

            // Verify signature
            String rawSignature = "accessKey=" + momoProperties.getAccessKey() +
                    "&amount=" + amount +
                    "&extraData=&orderId=" + orderId +
                    "&partnerCode=" + partnerCode +
                    "&partnerTransId=" + requestId +
                    "&requestId=" + requestId +
                    "&responseTime=" + responseTime +
                    "&resultCode=" + resultCode +
                    "&transId=" + transId;

            if (!verifySignature(signature, rawSignature)) {
                log.warn("Invalid Momo signature for order: {}", orderId);
                return Map.of("status", "error", "message", "Invalid signature");
            }

            // Find order and payment attempt
            Order order = orderRepository.findById(Long.parseLong(orderId))
                    .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));

            // Find payment attempt
            PaymentAttempt paymentAttempt = paymentAttemptRepository
                    .findAll()
                    .stream()
                    .filter(pa -> pa.getOrder().getId().equals(Long.parseLong(orderId)) && pa.getGatewayTxnId().equals(requestId))
                    .findFirst()
                    .orElse(null);

            if (paymentAttempt == null) {
                paymentAttempt = new PaymentAttempt();
                paymentAttempt.setOrder(order);
                paymentAttempt.setAmount(order.getTotalAmount());
                paymentAttempt.setCurrency("VND");
                paymentAttempt.setGatewayTxnId(requestId);
            }

            paymentAttempt.setResponseCode(Integer.parseInt(resultCode));
            paymentAttempt.setResponseMessage(message);
            paymentAttempt.setResponsePayload(objectMapper.writeValueAsString(params));

            // Handle result code
            if ("0".equals(resultCode)) {
                // Payment successful
                paymentAttempt.setPaymentStatus(PaymentStatus.PAID);
                paymentAttempt.setPaidAt(Instant.now());
                order.setPaymentStatus(PaymentStatus.PAID);
                order.setPaidAt(Instant.now());
                log.info("Payment successful for order: {}", orderId);
            } else {
                // Payment failed
                paymentAttempt.setPaymentStatus(PaymentStatus.FAILED);
                order.setPaymentStatus(PaymentStatus.FAILED);
                log.warn("Payment failed for order: {} with code: {}", orderId, resultCode);
            }

            paymentAttemptRepository.save(paymentAttempt);
            orderRepository.save(order);

            return Map.of("status", "success", "message", "IPN request processed");

        } catch (Exception e) {
            log.error("Error handling Momo IPN", e);
            return Map.of("status", "error", "message", "Error processing IPN");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> handlePaymentResult() {
        try {
            log.info("Handling Momo payment result");

            // This method would be called after redirect from Momo
            // Implementation depends on how the result URL passes data
            // Typically through query parameters

            Map<String, String> result = new HashMap<>();
            result.put("status", "success");
            result.put("message", "Payment result handled");

            return result;

        } catch (Exception e) {
            log.error("Error handling Momo payment result", e);
            return Map.of("status", "error", "message", "Error processing payment result");
        }
    }
}
