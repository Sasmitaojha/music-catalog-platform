package com.musiccatalog.backend.service;

import com.musiccatalog.backend.dto.AiInsightRequest;
import com.musiccatalog.backend.dto.AiInsightResponse;
import com.musiccatalog.backend.dto.AlbumResponse;
import com.musiccatalog.backend.entity.SavedAlbum;
import com.musiccatalog.backend.entity.User;
import com.musiccatalog.backend.repository.SavedAlbumRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiInsightsService {

    private static final Logger logger = LoggerFactory.getLogger(AiInsightsService.class);

    private final SavedAlbumRepository albumRepository;
    private final OpenAiClient openAiClient;

    public AiInsightsService(SavedAlbumRepository albumRepository, OpenAiClient openAiClient) {
        this.albumRepository = albumRepository;
        this.openAiClient = openAiClient;
    }

    @Transactional(readOnly = true)
    public AiInsightResponse generateInsight(User user, AiInsightRequest request) {
        List<SavedAlbum> library = albumRepository.findByUser(user);
        String mode = (request.getMode() != null && !request.getMode().isBlank()) ? request.getMode() : "recommendations";
        String query = (request.getQuery() != null) ? request.getQuery().toLowerCase() : "";

        AiInsightResponse response = new AiInsightResponse();

        if (library.isEmpty()) {
            response.setInsightSummary("Your music library is currently empty.");
            response.setDetailedAnalysis("Add a few albums from the catalog search to generate personalized AI recommendations and trends!");
            response.setRecommendations(generateDefaultRecommendations());
            response.setMatchingAlbums(Collections.emptyList());
            return response;
        }

        if (openAiClient != null && openAiClient.isEnabled()) {
            try {
                return openAiClient.generateInsightResponse(user, library, request);
            } catch (Exception ex) {
                logger.warn("OpenAI/Gemini request failed, falling back to built-in AI logic: {}", ex.getMessage());
            }
        }

        switch (mode.toLowerCase()) {
            case "nl_query":
                processNaturalLanguageQuery(library, query, response);
                break;
            case "trend_summary":
                processTrendSummary(library, response);
                break;
            case "recommendations":
            default:
                processRecommendations(library, response);
                break;
        }

        return response;
    }

    private void processRecommendations(List<SavedAlbum> library, AiInsightResponse response) {
        // Determine user's top genres & favorite artists
        Map<String, Long> genreCounts = library.stream()
                .collect(Collectors.groupingBy(
                        a -> (a.getGenre() != null && !a.getGenre().isBlank()) ? a.getGenre() : "Pop",
                        Collectors.counting()
                ));

        String topGenre = genreCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Rock");

        List<SavedAlbum> topRated = library.stream()
                .filter(a -> a.getUserRating() != null && a.getUserRating() >= 4)
                .collect(Collectors.toList());

        String favoriteArtist = topRated.isEmpty() ? library.get(0).getArtistName() : topRated.get(0).getArtistName();

        response.setInsightSummary("Based on your preference for " + topGenre + " and highly rated albums by " + favoriteArtist + ", here are curated AI recommendations.");
        response.setDetailedAnalysis("Your library exhibits a strong affinity for " + topGenre + " soundscapes with an average track depth of "
                + (int) library.stream().mapToInt(a -> a.getTrackCount() != null ? a.getTrackCount() : 10).average().orElse(12) + " songs per album.");

        List<AiInsightResponse.AlbumRecommendation> recs = new ArrayList<>();
        if ("Rock".equalsIgnoreCase(topGenre) || "Alternative".equalsIgnoreCase(topGenre)) {
            recs.add(new AiInsightResponse.AlbumRecommendation("OK Computer", "Radiohead", "Alternative Rock", "Matches your preference for atmospheric alternative rock with deep track counts."));
            recs.add(new AiInsightResponse.AlbumRecommendation("Abbey Road", "The Beatles", "Rock", "Timeless rock classic that complements your top-rated albums."));
            recs.add(new AiInsightResponse.AlbumRecommendation("AM", "Arctic Monkeys", "Indie Rock", "Sleek production and energetic riffs matching your listening profile."));
        } else if ("Pop".equalsIgnoreCase(topGenre)) {
            recs.add(new AiInsightResponse.AlbumRecommendation("Future Nostalgia", "Dua Lipa", "Pop / Disco", "High-energy retro-pop matching your high-rating trend."));
            recs.add(new AiInsightResponse.AlbumRecommendation("1989 (Taylor's Version)", "Taylor Swift", "Pop", "Critically acclaimed synth-pop masterpiece matching your library aesthetic."));
            recs.add(new AiInsightResponse.AlbumRecommendation("Melodrama", "Lorde", "Indie Pop", "Emotional, cohesive pop album praised for its storytelling."));
        } else if ("Electronic".equalsIgnoreCase(topGenre) || "Dance".equalsIgnoreCase(topGenre)) {
            recs.add(new AiInsightResponse.AlbumRecommendation("Random Access Memories", "Daft Punk", "Electronic", "Grammy-winning electronic classic with immaculate acoustic and synth fusion."));
            recs.add(new AiInsightResponse.AlbumRecommendation("Discovery", "Daft Punk", "Dance", "Iconic house and synth-pop milestone with high replay value."));
            recs.add(new AiInsightResponse.AlbumRecommendation("Immunity", "Jon Hopkins", "Ambient Electronic", "Intricate sound architecture that pairs with your album depth."));
        } else {
            recs.add(new AiInsightResponse.AlbumRecommendation("Kind of Blue", "Miles Davis", "Jazz", "Universal classic recommended to expand your catalog diversity."));
            recs.add(new AiInsightResponse.AlbumRecommendation("Rumours", "Fleetwood Mac", "Pop / Rock", "Essential listening with legendary harmonies and songwriting."));
            recs.add(new AiInsightResponse.AlbumRecommendation("The Dark Side of the Moon", "Pink Floyd", "Progressive Rock", "Masterpiece concept album that fits high-rating collectors."));
        }

        response.setRecommendations(recs);
        response.setMatchingAlbums(library.stream().limit(5).map(AlbumResponse::fromEntity).collect(Collectors.toList()));
    }

    private void processNaturalLanguageQuery(List<SavedAlbum> library, String query, AiInsightResponse response) {
        List<SavedAlbum> filtered = new ArrayList<>(library);

        boolean filteredAny = false;

        // Parse rating filter (e.g. 5 stars, 4 stars, high rated, top rated)
        if (query.contains("5 star") || query.contains("5-star") || query.contains("top rated") || query.contains("best")) {
            filtered = filtered.stream().filter(a -> a.getUserRating() != null && a.getUserRating() == 5).collect(Collectors.toList());
            filteredAny = true;
        } else if (query.contains("4 star") || query.contains("high rating") || query.contains("4+")) {
            filtered = filtered.stream().filter(a -> a.getUserRating() != null && a.getUserRating() >= 4).collect(Collectors.toList());
            filteredAny = true;
        }

        // Parse genre keyword
        for (SavedAlbum a : library) {
            if (a.getGenre() != null && query.contains(a.getGenre().toLowerCase())) {
                String targetGenre = a.getGenre().toLowerCase();
                filtered = filtered.stream().filter(item -> item.getGenre() != null && item.getGenre().toLowerCase().contains(targetGenre)).collect(Collectors.toList());
                filteredAny = true;
                break;
            }
        }

        // Parse artist or title query
        if (!filteredAny && !query.isBlank()) {
            filtered = library.stream()
                    .filter(a -> a.getTitle().toLowerCase().contains(query)
                            || a.getArtistName().toLowerCase().contains(query)
                            || (a.getUserNotes() != null && a.getUserNotes().toLowerCase().contains(query)))
                    .collect(Collectors.toList());
        }

        response.setInsightSummary("Natural language query executed: \"" + query + "\" returned " + filtered.size() + " matching album(s).");
        response.setDetailedAnalysis("AI evaluated your library against query criteria (rating, genre, artist, and personal notes keywords).");
        response.setMatchingAlbums(filtered.stream().map(AlbumResponse::fromEntity).collect(Collectors.toList()));
        response.setRecommendations(Collections.emptyList());
    }

    private void processTrendSummary(List<SavedAlbum> library, AiInsightResponse response) {
        int total = library.size();
        double avgRating = library.stream().mapToInt(a -> a.getUserRating() != null ? a.getUserRating() : 0).average().orElse(0.0);
        long totalTracks = library.stream().mapToInt(a -> a.getTrackCount() != null ? a.getTrackCount() : 0).sum();

        Map<String, Long> genreCounts = library.stream()
                .collect(Collectors.groupingBy(a -> a.getGenre() != null ? a.getGenre() : "Unspecified", Collectors.counting()));
        String primaryGenre = genreCounts.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("Diverse");

        response.setInsightSummary("Catalog Trend Summary: Your collection contains " + total + " album(s) across " + genreCounts.size() + " unique genre(s).");
        response.setDetailedAnalysis("Collection Profile: Primary genre emphasis is '" + primaryGenre + "'. Average user satisfaction score is "
                + String.format("%.2f", avgRating) + "/5.0. Total accumulated track count is " + totalTracks + " songs.");

        List<AiInsightResponse.AlbumRecommendation> highlights = new ArrayList<>();
        highlights.add(new AiInsightResponse.AlbumRecommendation("Genre Density", primaryGenre, "Dominant Category", "Represents " + String.format("%.0f", (genreCounts.getOrDefault(primaryGenre, 1L) * 100.0 / total)) + "% of your overall saved catalog."));
        highlights.add(new AiInsightResponse.AlbumRecommendation("Quality Metric", String.format("%.2f Stars", avgRating), "User Rating Index", "Indicates high curation precision in your library additions."));

        response.setRecommendations(highlights);
        response.setMatchingAlbums(library.stream().map(AlbumResponse::fromEntity).collect(Collectors.toList()));
    }

    private List<AiInsightResponse.AlbumRecommendation> generateDefaultRecommendations() {
        return List.of(
                new AiInsightResponse.AlbumRecommendation("Parachutes", "Coldplay", "Alternative", "Classic debut album featuring iconic melodic arrangements."),
                new AiInsightResponse.AlbumRecommendation("1989", "Taylor Swift", "Pop", "Define modern pop production with hit singles."),
                new AiInsightResponse.AlbumRecommendation("Random Access Memories", "Daft Punk", "Electronic", "Masterpiece blend of electronic and funk instrumentation.")
        );
    }
}
