package com.project.maltbackend.response;

import lombok.Data;

@Data
public class PaymentResponse {

    private String payment_url;
    private String signature;
    private String signedFieldNames;

}
