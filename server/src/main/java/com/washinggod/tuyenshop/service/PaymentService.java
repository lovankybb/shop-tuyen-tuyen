package com.washinggod.tuyenshop.service;

import java.util.Map;

public interface PaymentService {

        String createPaymentUrl(String orderId, String amount, String orderInfo, String returnUrl, String notifyUrl);

        boolean verifySignature(String signature, String data);

        Object ipnHandle(Map<String, String> params);

        Map<String, String> handlePaymentResult();
}
