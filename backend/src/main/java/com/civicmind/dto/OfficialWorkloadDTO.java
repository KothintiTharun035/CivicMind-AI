package com.civicmind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfficialWorkloadDTO {

    private String officialId;
    private String officialName;
    private String officialEmail;
    private long issueCount;
}