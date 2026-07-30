package com.musiccatalog.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class ItunesSearchService {

    private static final String ITUNES_SEARCH_URL = "https://itunes.apple.com/search";
    private final RestTemplate restTemplate;

    public ItunesSearchService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> searchCatalog(String query, String entity, Integer limit) {
        String targetEntity = (entity != null && !entity.isBlank()) ? entity : "album";
        int targetLimit = (limit != null && limit > 0) ? Math.min(limit, 50) : 25;

        String uri = UriComponentsBuilder.fromHttpUrl(ITUNES_SEARCH_URL)
                .queryParam("term", query)
                .queryParam("entity", targetEntity)
                .queryParam("limit", targetLimit)
                .toUriString();

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(uri, Map.class);
            return response != null ? response : new HashMap<>();
        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("resultCount", 0);
            errorMap.put("results", new Object[0]);
            errorMap.put("error", "Failed to fetch from iTunes Search API: " + e.getMessage());
            return errorMap;
        }
    }
}
