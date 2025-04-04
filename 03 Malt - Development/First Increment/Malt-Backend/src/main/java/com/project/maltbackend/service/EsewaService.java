package com.project.maltbackend.service;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.response.PaymentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;

@Service
public class EsewaService {

    private final String ESEWA_MERCHANT_ID = "EPAYTEST";
    private final String ESEWA_BASE_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    private final String SUCCESS_URL = "http://localhost:5173/payment/success";
    private final String FAILURE_URL = "http://localhost:5173/payment/fail";

    @Value("${esewa.secretKey}")
    private String secretKey;


    public String generateSignature(String totalAmount, String transactionUUID, String productCode) {
        try {
            String message = "total_amount=" + totalAmount +
                    ",transaction_uuid=" + transactionUUID +
                    ",product_code=" + productCode +
                    ",secret=" + secretKey;

            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            return Base64.encodeBase64String(sha256_HMAC.doFinal(message.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Error generating signature", e);
        }
    }


    public PaymentResponse createEsewaPaymentLink(Order order) {
        String referenceId = "ORD-" + order.getId().toString().replaceAll("[^a-zA-Z0-9-]", "");
        String totalAmount = String.valueOf(order.getTotalPrice());
        String productCode = "EPAYTEST";

        String signature = generateSignature(totalAmount, referenceId, productCode);
        String signedFields = "total_amount,transaction_uuid,product_code";

        // (Optional) Generate a preview form URL for debugging/testing
        StringBuilder formBuilder = new StringBuilder();
        formBuilder.append(ESEWA_BASE_URL)
                .append("?amount=").append(order.getTotalPrice())
                .append("&tax_amount=0")
                .append("&total_amount=").append(order.getTotalPrice())
                .append("&transaction_uuid=").append(referenceId)
                .append("&product_code=").append(productCode)
                .append("&product_service_charge=0")
                .append("&product_delivery_charge=0")
                .append("&success_url=").append(SUCCESS_URL)
                .append("&failure_url=").append(FAILURE_URL)
                .append("&signed_field_names=").append(signedFields)
                .append("&signature=").append(signature);

        PaymentResponse response = new PaymentResponse();
        response.setPayment_url(formBuilder.toString());
        response.setSignature(signature);
        response.setSignedFieldNames(signedFields);

        System.out.println("transaction_uuid = " + referenceId);
        System.out.println("Signature message = total_amount=" + totalAmount +
                ",transaction_uuid=" + referenceId +
                ",product_code=" + productCode +
                ",secret=" + secretKey);
        System.out.println("Signature = " + signature);

        return response;
    }

}
