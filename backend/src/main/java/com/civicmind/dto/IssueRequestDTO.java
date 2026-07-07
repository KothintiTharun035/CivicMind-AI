package com.civicmind.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IssueRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Double latitude;
    private Double longitude;
    private String address;
    private String imageUrl;
}
