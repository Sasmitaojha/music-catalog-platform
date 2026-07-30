package com.musiccatalog.backend.dto;

public class AiInsightRequest {

    private String query;
    private String mode; // "recommendations", "nl_query", "trend_summary"

    public AiInsightRequest() {
    }

    public AiInsightRequest(String query, String mode) {
        this.query = query;
        this.mode = mode;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}
