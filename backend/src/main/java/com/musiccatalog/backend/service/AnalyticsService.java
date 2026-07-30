package com.musiccatalog.backend.service;

import com.musiccatalog.backend.dto.AnalyticsResponse;
import com.musiccatalog.backend.entity.SavedAlbum;
import com.musiccatalog.backend.entity.User;
import com.musiccatalog.backend.repository.SavedAlbumRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final SavedAlbumRepository albumRepository;

    public AnalyticsService(SavedAlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getUserAnalytics(User user) {
        List<SavedAlbum> albums = albumRepository.findByUser(user);

        AnalyticsResponse response = new AnalyticsResponse();
        response.setTotalAlbums(albums.size());

        if (albums.isEmpty()) {
            response.setAverageRating(0.0);
            response.setTotalTracks(0);
            response.setTopGenre("None");
            response.setReleasesByYear(Collections.emptyList());
            response.setGenreBreakdown(Collections.emptyList());
            response.setRatingsDistribution(Collections.emptyList());
            response.setTrackCountHistogram(Collections.emptyList());
            response.setTopArtists(Collections.emptyList());
            return response;
        }

        // Calculate average rating
        double avgRating = albums.stream()
                .filter(a -> a.getUserRating() != null)
                .mapToInt(SavedAlbum::getUserRating)
                .average()
                .orElse(0.0);
        response.setAverageRating(Math.round(avgRating * 100.0) / 100.0);

        // Calculate total tracks
        long totalTracks = albums.stream()
                .filter(a -> a.getTrackCount() != null)
                .mapToInt(SavedAlbum::getTrackCount)
                .sum();
        response.setTotalTracks(totalTracks);

        // Genre Breakdown & Top Genre
        Map<String, Long> genreCounts = albums.stream()
                .collect(Collectors.groupingBy(
                        a -> (a.getGenre() != null && !a.getGenre().isBlank()) ? a.getGenre() : "Unknown",
                        Collectors.counting()
                ));

        List<AnalyticsResponse.LabelValue> genreList = genreCounts.entrySet().stream()
                .map(e -> new AnalyticsResponse.LabelValue(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingDouble(AnalyticsResponse.LabelValue::getValue).reversed())
                .collect(Collectors.toList());
        response.setGenreBreakdown(genreList);

        String topGenre = genreList.isEmpty() ? "None" : genreList.get(0).getLabel();
        response.setTopGenre(topGenre);

        // Releases by Year
        Map<String, Long> yearCounts = new TreeMap<>();
        for (SavedAlbum album : albums) {
            String year = extractYear(album.getReleaseDate());
            if (year != null) {
                yearCounts.put(year, yearCounts.getOrDefault(year, 0L) + 1);
            }
        }
        List<AnalyticsResponse.LabelValue> yearList = yearCounts.entrySet().stream()
                .map(e -> new AnalyticsResponse.LabelValue(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        response.setReleasesByYear(yearList);

        // Ratings Distribution (1 to 5 stars)
        Map<Integer, Long> ratingCounts = new TreeMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingCounts.put(i, 0L);
        }
        for (SavedAlbum album : albums) {
            if (album.getUserRating() != null && album.getUserRating() >= 1 && album.getUserRating() <= 5) {
                ratingCounts.put(album.getUserRating(), ratingCounts.get(album.getUserRating()) + 1);
            }
        }
        List<AnalyticsResponse.LabelValue> ratingsList = ratingCounts.entrySet().stream()
                .map(e -> new AnalyticsResponse.LabelValue(e.getKey() + " Stars", e.getValue()))
                .collect(Collectors.toList());
        response.setRatingsDistribution(ratingsList);

        // Track Count Histogram (Ranges: 1-5, 6-10, 11-15, 16-20, 21+)
        Map<String, Long> trackHistogram = new LinkedHashMap<>();
        trackHistogram.put("1-5 tracks", 0L);
        trackHistogram.put("6-10 tracks", 0L);
        trackHistogram.put("11-15 tracks", 0L);
        trackHistogram.put("16-20 tracks", 0L);
        trackHistogram.put("21+ tracks", 0L);

        for (SavedAlbum album : albums) {
            int count = album.getTrackCount() != null ? album.getTrackCount() : 0;
            if (count >= 1 && count <= 5) trackHistogram.put("1-5 tracks", trackHistogram.get("1-5 tracks") + 1);
            else if (count >= 6 && count <= 10) trackHistogram.put("6-10 tracks", trackHistogram.get("6-10 tracks") + 1);
            else if (count >= 11 && count <= 15) trackHistogram.put("11-15 tracks", trackHistogram.get("11-15 tracks") + 1);
            else if (count >= 16 && count <= 20) trackHistogram.put("16-20 tracks", trackHistogram.get("16-20 tracks") + 1);
            else if (count >= 21) trackHistogram.put("21+ tracks", trackHistogram.get("21+ tracks") + 1);
        }
        List<AnalyticsResponse.LabelValue> histogramList = trackHistogram.entrySet().stream()
                .map(e -> new AnalyticsResponse.LabelValue(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        response.setTrackCountHistogram(histogramList);

        // Top Artists Horizontal Bar Chart
        Map<String, Long> artistCounts = albums.stream()
                .collect(Collectors.groupingBy(
                        a -> (a.getArtistName() != null && !a.getArtistName().isBlank()) ? a.getArtistName() : "Unknown",
                        Collectors.counting()
                ));
        List<AnalyticsResponse.LabelValue> topArtistList = artistCounts.entrySet().stream()
                .map(e -> new AnalyticsResponse.LabelValue(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingDouble(AnalyticsResponse.LabelValue::getValue).reversed())
                .limit(7)
                .collect(Collectors.toList());
        response.setTopArtists(topArtistList);

        return response;
    }

    private String extractYear(String releaseDate) {
        if (releaseDate == null || releaseDate.isBlank()) return "Unknown";
        if (releaseDate.length() >= 4 && releaseDate.substring(0, 4).matches("\\d{4}")) {
            return releaseDate.substring(0, 4);
        }
        return "Unknown";
    }
}
