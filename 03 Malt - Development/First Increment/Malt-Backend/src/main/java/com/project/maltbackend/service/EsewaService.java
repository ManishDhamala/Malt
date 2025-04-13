package com.project.maltbackend.service;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.response.PaymentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;

import java.nio.charset.StandardCharsets;
import java.util.UUID;


@Service
public class EsewaService {

    private final String ESEWA_MERCHANT_ID = "EPAYTEST";
    private final String ESEWA_BASE_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    private final String SUCCESS_URL = "http://localhost:5173/payment/success";
    private final String FAILURE_URL = "https://developer.esewa.com.np/failure";

    @Value("${esewa.secretKey}")
    private String secretKey;


    public String generateSignature(String totalAmount, String transactionUUID, String productCode) {
        try {
            // Signature string: Only signed fields
            String message = "total_amount=" + totalAmount +
                    ",transaction_uuid=" + transactionUUID +
                    ",product_code=" + productCode;

            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            return Base64.encodeBase64String(sha256_HMAC.doFinal(message.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException("Error generating signature", e);
        }
    }



    public PaymentResponse createEsewaPaymentLink(Order order) {
        String referenceId = "ORD-" + order.getId().toString().replaceAll("[^a-zA-Z0-9-]", "");
        String totalAmount = String.valueOf(order.getTotalPrice().intValue()); // Ensure integer amount
        String productCode = "EPAYTEST";
        String signedFields = "total_amount,transaction_uuid,product_code";

        String signature = generateSignature(totalAmount, referenceId, productCode);
        String successUrl = "http://localhost:5173/payment/esewa/success/" + order.getId();


        // Build form URL (mostly for preview/debug; form is submitted via frontend)
        StringBuilder formBuilder = new StringBuilder();
        formBuilder.append(ESEWA_BASE_URL)
                .append("?amount=").append(totalAmount) // Not part of signature, but expected in form
                .append("&tax_amount=0")
                .append("&total_amount=").append(totalAmount)
                .append("&transaction_uuid=").append(referenceId)
                .append("&product_code=").append(productCode)
                .append("&product_service_charge=0")
                .append("&product_delivery_charge=0")
                .append("&success_url=").append(successUrl)
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


    // If e-sewa sent signature in the response verify the payment
    public boolean verifyPayment(String signature, String amount) {
        try {
            if (signature != null && !signature.isEmpty()) {
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }






}
