package com.musiccatalog.backend.dto;

import com.musiccatalog.backend.entity.SavedAlbum;
import java.time.Instant;

public class AlbumResponse {

    private Long id;
    private Long appleCatalogId;
    private String title;
    private String artistName;
    private String genre;
    private String releaseDate;
    private Integer trackCount;
    private String artworkUrl;
    private Integer userRating;
    private String userNotes;
    private Instant createdAt;
    private Instant updatedAt;

    public AlbumResponse() {
    }

    public static AlbumResponse fromEntity(SavedAlbum album) {
        AlbumResponse resp = new AlbumResponse();
        resp.setId(album.getId());
        resp.setAppleCatalogId(album.getAppleCatalogId());
        resp.setTitle(album.getTitle());
        resp.setArtistName(album.getArtistName());
        resp.setGenre(album.getGenre());
        resp.setReleaseDate(album.getReleaseDate());
        resp.setTrackCount(album.getTrackCount());
        resp.setArtworkUrl(album.getArtworkUrl());
        resp.setUserRating(album.getUserRating());
        resp.setUserNotes(album.getUserNotes());
        resp.setCreatedAt(album.getCreatedAt());
        resp.setUpdatedAt(album.getUpdatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAppleCatalogId() {
        return appleCatalogId;
    }

    public void setAppleCatalogId(Long appleCatalogId) {
        this.appleCatalogId = appleCatalogId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Integer getTrackCount() {
        return trackCount;
    }

    public void setTrackCount(Integer trackCount) {
        this.trackCount = trackCount;
    }

    public String getArtworkUrl() {
        return artworkUrl;
    }

    public void setArtworkUrl(String artworkUrl) {
        this.artworkUrl = artworkUrl;
    }

    public Integer getUserRating() {
        return userRating;
    }

    public void setUserRating(Integer userRating) {
        this.userRating = userRating;
    }

    public String getUserNotes() {
        return userNotes;
    }

    public void setUserNotes(String userNotes) {
        this.userNotes = userNotes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
