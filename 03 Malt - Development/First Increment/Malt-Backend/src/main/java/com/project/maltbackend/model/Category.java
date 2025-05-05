package com.project.maltbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE category SET deleted = true WHERE id=?") // For automatic soft delete instead of hard delete
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

   @ManyToOne
   @JoinColumn(name = "restaurant_id") //  Foreign key
   @JsonIgnore
   private Restaurant restaurant;

    private boolean deleted = false; // Soft delete flag

    @CreationTimestamp
    @Column(updatable = false)
    private Date createdAt;

    private Date deletedAt;

}
