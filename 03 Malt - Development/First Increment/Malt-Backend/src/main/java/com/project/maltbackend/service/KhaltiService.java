package com.project.maltbackend.service;

import com.project.maltbackend.model.Order;
import com.project.maltbackend.response.PaymentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class KhaltiService {

    @Value("${khalti.secretKey}")
    private String secretKey;

    private static final String INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";

    private final RestTemplate restTemplate;

    public KhaltiService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public PaymentResponse createKhaltiPayment(Order order) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Key " + secretKey);

        Map<String, Object> body = new HashMap<>();
        body.put("return_url", "http://localhost:5173/payment/khalti/callback"); // Change to your frontend callback route
        body.put("website_url", "http://localhost:5173"); // Your website URL
        body.put("amount", order.getTotalPrice() * 100); // Khalti requires amount in paisa
        body.put("purchase_order_id", String.valueOf(order.getId()));
        body.put("purchase_order_name", "Order #" + order.getId());

        System.out.println("✅ Creating Khalti payment for order ID: " + order.getId());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(INITIATE_URL, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                PaymentResponse paymentResponse = new PaymentResponse();
                paymentResponse.setPayment_url((String) responseBody.get("payment_url"));
                paymentResponse.setSignature((String) responseBody.get("pidx")); // Optional: You can use this for verification
                paymentResponse.setSignedFieldNames("pidx,purchase_order_id,amount"); // Optional: For consistency

                return paymentResponse;
            } else {
                throw new Exception("Khalti payment initiation failed");
            }
        } catch (HttpClientErrorException e) {
            throw new Exception("Khalti API error: " + e.getResponseBodyAsString());
        }
    }


    public Map<String, Object> verifyKhaltiPayment(String pidx) throws Exception {
        String url = "https://a.khalti.com/api/v2/epayment/lookup/";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Key " + secretKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("pidx", pidx);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            throw new Exception("Khalti verification failed: " + e.getResponseBodyAsString());
        }
    }


}

