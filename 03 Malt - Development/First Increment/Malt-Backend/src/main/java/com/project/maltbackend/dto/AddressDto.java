package com.project.maltbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AddressDto {

    private Long id;
    private String streetAddress;
    private String city;
    private String province;
    private String postalCode;
    private String country;
    private String landmark;

}
