package com.musiccatalog.backend.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private long totalAlbums;
    private double averageRating;
    private long totalTracks;
    private String topGenre;

    private List<LabelValue> releasesByYear;
    private List<LabelValue> genreBreakdown;
    private List<LabelValue> ratingsDistribution;
    private List<LabelValue> trackCountHistogram;
    private List<LabelValue> topArtists;

    public AnalyticsResponse() {
    }

    public static class LabelValue {
        private String label;
        private double value;

        public LabelValue() {
        }

        public LabelValue(String label, double value) {
            this.label = label;
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public double getValue() {
            return value;
        }

        public void setValue(double value) {
            this.value = value;
        }
    }

    // Getters and Setters

    public long getTotalAlbums() {
        return totalAlbums;
    }

    public void setTotalAlbums(long totalAlbums) {
        this.totalAlbums = totalAlbums;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalTracks() {
        return totalTracks;
    }

    public void setTotalTracks(long totalTracks) {
        this.totalTracks = totalTracks;
    }

    public String getTopGenre() {
        return topGenre;
    }

    public void setTopGenre(String topGenre) {
        this.topGenre = topGenre;
    }

    public List<LabelValue> getReleasesByYear() {
        return releasesByYear;
    }

    public void setReleasesByYear(List<LabelValue> releasesByYear) {
        this.releasesByYear = releasesByYear;
    }

    public List<LabelValue> getGenreBreakdown() {
        return genreBreakdown;
    }

    public void setGenreBreakdown(List<LabelValue> genreBreakdown) {
        this.genreBreakdown = genreBreakdown;
    }

    public List<LabelValue> getRatingsDistribution() {
        return ratingsDistribution;
    }

    public void setRatingsDistribution(List<LabelValue> ratingsDistribution) {
        this.ratingsDistribution = ratingsDistribution;
    }

    public List<LabelValue> getTrackCountHistogram() {
        return trackCountHistogram;
    }

    public void setTrackCountHistogram(List<LabelValue> trackCountHistogram) {
        this.trackCountHistogram = trackCountHistogram;
    }

    public List<LabelValue> getTopArtists() {
        return topArtists;
    }

    public void setTopArtists(List<LabelValue> topArtists) {
        this.topArtists = topArtists;
    }
}
