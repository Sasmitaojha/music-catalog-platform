package com.musiccatalog.backend.dto;

import java.util.List;

public class AiInsightResponse {

    private String insightSummary;
    private String detailedAnalysis;
    private List<AlbumRecommendation> recommendations;
    private List<AlbumResponse> matchingAlbums;

    public AiInsightResponse() {
    }

    public static class AlbumRecommendation {
        private String title;
        private String artist;
        private String genre;
        private String reason;

        public AlbumRecommendation() {
        }

        public AlbumRecommendation(String title, String artist, String genre, String reason) {
            this.title = title;
            this.artist = artist;
            this.genre = genre;
            this.reason = reason;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getArtist() {
            return artist;
        }

        public void setArtist(String artist) {
            this.artist = artist;
        }

        public String getGenre() {
            return genre;
        }

        public void setGenre(String genre) {
            this.genre = genre;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    // Getters and Setters

    public String getInsightSummary() {
        return insightSummary;
    }

    public void setInsightSummary(String insightSummary) {
        this.insightSummary = insightSummary;
    }

    public String getDetailedAnalysis() {
        return detailedAnalysis;
    }

    public void setDetailedAnalysis(String detailedAnalysis) {
        this.detailedAnalysis = detailedAnalysis;
    }

    public List<AlbumRecommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<AlbumRecommendation> recommendations) {
        this.recommendations = recommendations;
    }

    public List<AlbumResponse> getMatchingAlbums() {
        return matchingAlbums;
    }

    public void setMatchingAlbums(List<AlbumResponse> matchingAlbums) {
        this.matchingAlbums = matchingAlbums;
    }
}
