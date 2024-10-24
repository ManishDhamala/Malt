package com.project.maltbackend.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable   // This annotation declare that this class will be embedded by other entities.
@Data
public class ContactInformation {

    private String email;

    private String mobile;

    private String twitter;

    private String instagram;


}
