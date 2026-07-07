package com.civicmind.service;

import com.civicmind.dto.AIClassificationResult;
import com.civicmind.model.enums.UrgencyLevel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AIService {

    @Value("${app.ai.api-key}")
    private String apiKey;

    @Value("${app.ai.model}")
    private String model;

    private final WebClient webClient =
            WebClient.builder()
                    .baseUrl(
                            "https://generativelanguage.googleapis.com"
                    )
                    .build();

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    // =========================
    // CLASSIFY CIVIC ISSUE
    // =========================
    public AIClassificationResult classify(
            String title,
            String description
    ) {

        // No Gemini key configured
        if (apiKey == null || apiKey.isBlank()) {

            log.warn(
                    "GEMINI_API_KEY is missing. " +
                    "Using fallback classifier."
            );

            return fallbackClassify(
                    title,
                    description
            );
        }

        try {

            String prompt = """
                    You are an AI triage system for a civic issue
                    reporting platform.

                    Analyze the citizen report carefully using
                    the actual meaning, danger, public impact,
                    affected location, and risk to human safety.

                    Citizen Report:

                    Title: %s

                    Description: %s

                    Choose exactly ONE category from:
                    Roads
                    Sanitation
                    Water Supply
                    Electricity
                    Public Safety
                    Parks
                    Other

                    Choose exactly ONE urgency from:
                    LOW
                    MEDIUM
                    HIGH
                    CRITICAL

                    Urgency rules:

                    LOW:
                    Minor inconvenience, cosmetic issue,
                    low immediate impact.

                    MEDIUM:
                    Significant issue requiring attention,
                    but no immediate major danger.

                    HIGH:
                    Serious disruption, accident risk,
                    major infrastructure problem,
                    or substantial public impact.

                    CRITICAL:
                    Immediate threat to life,
                    electrocution risk,
                    major fire risk,
                    severe flooding,
                    dangerous exposed infrastructure,
                    or emergency requiring immediate action.

                    Important:
                    Do not mark every issue MEDIUM.
                    Use the report context to distinguish
                    LOW, MEDIUM, HIGH, and CRITICAL.

                    Return ONLY valid raw JSON.
                    Do not use markdown.
                    Do not add explanation outside JSON.

                    Exact format:

                    {
                      "category": "Roads",
                      "urgency": "HIGH",
                      "summary": "One sentence summary"
                    }
                    """.formatted(
                    title,
                    description
            );

            // Gemini request body
            Map<String, Object> requestBody =
                    Map.of(
                            "contents",
                            List.of(
                                    Map.of(
                                            "parts",
                                            List.of(
                                                    Map.of(
                                                            "text",
                                                            prompt
                                                    )
                                            )
                                    )
                            ),
                            "generationConfig",
                            Map.of(
                                    "temperature",
                                    0.2,
                                    "responseMimeType",
                                    "application/json"
                            )
                    );

            String responseBody =
                    webClient.post()
                            .uri(uriBuilder ->
                                    uriBuilder
                                            .path(
                                                    "/v1beta/models/{model}:generateContent"
                                            )
                                            .queryParam(
                                                    "key",
                                                    apiKey
                                            )
                                            .build(model)
                            )
                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )
                            .bodyValue(requestBody)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();

            String aiText =
                    extractGeminiText(responseBody);

            String cleaned =
                    aiText
                            .replace("```json", "")
                            .replace("```", "")
                            .trim();

            AIClassificationResult result =
                    objectMapper.readValue(
                            cleaned,
                            AIClassificationResult.class
                    );

            validateResult(result);

            log.info(
                    "GEMINI_AI classification successful: " +
                    "category={}, urgency={}",
                    result.getCategory(),
                    result.getUrgency()
            );

            return result;

        } catch (Exception e) {

            log.error(
                    "GEMINI_AI classification failed. " +
                    "Using fallback classifier.",
                    e
            );

            return fallbackClassify(
                    title,
                    description
            );
        }
    }

    // =========================
    // EXTRACT GEMINI TEXT
    // =========================
    private String extractGeminiText(
            String responseBody
    ) throws Exception {

        if (responseBody == null ||
                responseBody.isBlank()) {

            throw new RuntimeException(
                    "Empty response from Gemini"
            );
        }

        JsonNode root =
                objectMapper.readTree(responseBody);

        JsonNode textNode =
                root.path("candidates")
                        .path(0)
                        .path("content")
                        .path("parts")
                        .path(0)
                        .path("text");

        if (textNode.isMissingNode() ||
                textNode.asText().isBlank()) {

            throw new RuntimeException(
                    "Gemini response does not contain text"
            );
        }

        return textNode.asText();
    }

    // =========================
    // VALIDATE AI RESULT
    // =========================
    private void validateResult(
            AIClassificationResult result
    ) {

        if (result == null) {
            throw new RuntimeException(
                    "AI classification result is null"
            );
        }

        if (result.getCategory() == null ||
                result.getCategory().isBlank()) {

            throw new RuntimeException(
                    "AI returned empty category"
            );
        }

        if (result.getUrgency() == null) {

            throw new RuntimeException(
                    "AI returned empty urgency"
            );
        }

        List<String> allowedCategories =
                List.of(
                        "Roads",
                        "Sanitation",
                        "Water Supply",
                        "Electricity",
                        "Public Safety",
                        "Parks",
                        "Other"
                );

        if (!allowedCategories.contains(
                result.getCategory()
        )) {

            throw new RuntimeException(
                    "Invalid AI category: " +
                    result.getCategory()
            );
        }
    }

    // =========================
    // FALLBACK CLASSIFIER
    // =========================
    private AIClassificationResult fallbackClassify(
            String title,
            String description
    ) {

        String text =
                (title + " " + description)
                        .toLowerCase();

        String category = "Other";
        UrgencyLevel urgency =
                UrgencyLevel.MEDIUM;

        // Category detection
        if (text.contains("pothole") ||
                text.contains("road") ||
                text.contains("street")) {

            category = "Roads";

        } else if (
                text.contains("garbage") ||
                text.contains("trash") ||
                text.contains("waste")
        ) {

            category = "Sanitation";

        } else if (
                text.contains("water") ||
                text.contains("leak") ||
                text.contains("pipe")
        ) {

            category = "Water Supply";

        } else if (
                text.contains("power") ||
                text.contains("electric") ||
                text.contains("wire") ||
                text.contains("transformer")
        ) {

            category = "Electricity";

        } else if (
                text.contains("crime") ||
                text.contains("unsafe") ||
                text.contains("danger")
        ) {

            category = "Public Safety";

        } else if (
                text.contains("park") ||
                text.contains("tree") ||
                text.contains("garden")
        ) {

            category = "Parks";
        }

        // Better fallback urgency detection
        if (
                text.contains("live wire") ||
                text.contains("electrocution") ||
                text.contains("major fire") ||
                text.contains("life threatening") ||
                text.contains("severe flooding") ||
                text.contains("emergency")
        ) {

            urgency = UrgencyLevel.CRITICAL;

        } else if (
                text.contains("accident") ||
                text.contains("dangerous") ||
                text.contains("school children") ||
                text.contains("hospital") ||
                text.contains("major leak") ||
                text.contains("severe") ||
                text.contains("unsafe")
        ) {

            urgency = UrgencyLevel.HIGH;

        } else if (
                text.contains("minor") ||
                text.contains("small") ||
                text.contains("cosmetic")
        ) {

            urgency = UrgencyLevel.LOW;
        }

        log.warn(
                "FALLBACK classification used: " +
                "category={}, urgency={}",
                category,
                urgency
        );

        return new AIClassificationResult(
                category,
                urgency,
                "Auto-classified using fallback rules."
        );
    }
}