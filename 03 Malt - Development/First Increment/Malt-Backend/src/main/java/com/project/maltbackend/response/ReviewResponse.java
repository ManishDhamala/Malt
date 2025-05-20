package com.project.maltbackend.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private String userFullName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
