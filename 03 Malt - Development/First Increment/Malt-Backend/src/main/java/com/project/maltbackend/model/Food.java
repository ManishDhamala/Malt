package com.project.maltbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE food SET deleted = true WHERE id=?") // For automatic soft delete instead of hard delete
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String description;

    private Long price;

    @ManyToOne
    private Category foodCategory;

    @Column(length = 1000)
    @ElementCollection
    private List<String> images;

    private boolean available = true;

    @ManyToOne
    private Restaurant restaurant;

    private boolean isVegetarian;

    private Date creationDate;

    private Boolean deleted = false; // Soft delete flag

    private Date deletedAt;

}
