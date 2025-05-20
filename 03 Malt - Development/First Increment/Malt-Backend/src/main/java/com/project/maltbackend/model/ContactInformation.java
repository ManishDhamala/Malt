package com.project.maltbackend.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable   // This annotation declare that this class will be embedded by other entities.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactInformation {

    private String email;

    private String mobile;

    private String twitter;

    private String instagram;


}
