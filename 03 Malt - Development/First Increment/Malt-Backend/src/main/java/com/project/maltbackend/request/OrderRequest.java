package com.project.maltbackend.request;

import com.project.maltbackend.model.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

//    @NotNull
    private Long restaurantId;

//    @NotNull
//    @Valid
    private Address deliveryAddress;

}
