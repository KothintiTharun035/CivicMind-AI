package com.civicmind.dto;

import com.civicmind.model.enums.UrgencyLevel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIClassificationResult {
    private String category;
    private UrgencyLevel urgency;
    private String summary;
}
