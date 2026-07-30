package com.musiccatalog.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musiccatalog.backend.dto.AiInsightRequest;
import com.musiccatalog.backend.dto.AiInsightResponse;
import com.musiccatalog.backend.entity.SavedAlbum;
import com.musiccatalog.backend.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OpenAiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final String model;
    private final boolean enabled;

    public OpenAiClient(RestTemplate restTemplate,
                        ObjectMapper objectMapper,
                        @Value("${OPENAI_API_KEY:}") String apiKey,
                        @Value("${OPENAI_API_URL:https://api.openai.com/v1/chat/completions}") String apiUrl,
                        @Value("${OPENAI_MODEL:gpt-4o-mini}") String model) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
        this.enabled = apiKey != null && !apiKey.isBlank();
    }

    public boolean isEnabled() {
        return enabled;
    }

    public AiInsightResponse generateInsightResponse(User user, List<SavedAlbum> library, AiInsightRequest request) {
        String prompt = buildPrompt(user.getUsername(), library, request);
        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        body.put("temperature", 0.7);
        body.put("max_tokens", 800);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(apiUrl, entity, Map.class);

        if (response == null || !response.containsKey("choices")) {
            throw new RuntimeException("OpenAI response did not contain choices");
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices.isEmpty()) {
            throw new RuntimeException("OpenAI response contains no choices");
        }

        Map<String, Object> firstChoice = choices.get(0);
        Object messageObj = firstChoice.get("message");
        if (!(messageObj instanceof Map<?, ?>)) {
            throw new RuntimeException("OpenAI response message format unexpected");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> message = (Map<String, Object>) messageObj;
        String content = (String) message.get("content");
        if (content == null || content.isBlank()) {
            throw new RuntimeException("OpenAI response content is empty");
        }

        try {
            String json = extractJson(content);
            return objectMapper.readValue(json, AiInsightResponse.class);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to parse OpenAI response", ex);
        }
    }

    private String buildPrompt(String username, List<SavedAlbum> library, AiInsightRequest request) {
        String userMode = request.getMode() != null ? request.getMode() : "recommendations";
        String query = request.getQuery() != null ? request.getQuery() : "";

        String albumSummary = library.stream()
                .limit(10)
                .map(album -> String.format("{title: '%s', artist: '%s', genre: '%s', rating: %s, tracks: %s, notes: '%s'}",
                        safe(album.getTitle()), safe(album.getArtistName()), safe(album.getGenre()),
                        album.getUserRating() != null ? album.getUserRating() : 0,
                        album.getTrackCount() != null ? album.getTrackCount() : 0,
                        safe(album.getUserNotes())))
                .collect(Collectors.joining(",\n"));

        return "You are a music recommendation and analytics assistant. " +
                "Generate a JSON object only, without additional explanation, using the following schema:\n" +
                "{\n" +
                "  \"insightSummary\": string,\n" +
                "  \"detailedAnalysis\": string,\n" +
                "  \"recommendations\": [\n" +
                "    {\"title\": string, \"artist\": string, \"genre\": string, \"reason\": string}\n" +
                "  ],\n" +
                "  \"matchingAlbums\": [\n" +
                "    {\"title\": string, \"artistName\": string, \"genre\": string, \"releaseDate\": string, \"trackCount\": integer, \"artworkUrl\": string, \"userRating\": integer, \"userNotes\": string}\n" +
                "  ]\n" +
                "}\n" +
                "Respond to the mode '" + userMode + "' and query '" + query + "'.\n" +
                "Use the following user library metadata as context:\n" +
                albumSummary + "\n" +
                "If the library is empty, return a helpful summary and default recommendations.\n" +
                "Do not include markdown formatting or backticks. Only return valid JSON.";
    }

    private String safe(String value) {
        return value == null ? "" : value.replace("\n", " ").replace("\"", "'").replace("\\", "");
    }

    private String extractJson(String content) {
        int first = content.indexOf('{');
        int last = content.lastIndexOf('}');
        if (first >= 0 && last > first) {
            return content.substring(first, last + 1).trim();
        }
        return content.trim();
    }
}
