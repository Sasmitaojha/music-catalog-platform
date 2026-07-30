package com.musiccatalog.backend.service;

import com.musiccatalog.backend.dto.AlbumRequest;
import com.musiccatalog.backend.dto.AlbumResponse;
import com.musiccatalog.backend.entity.SavedAlbum;
import com.musiccatalog.backend.entity.User;
import com.musiccatalog.backend.exception.BadRequestException;
import com.musiccatalog.backend.exception.ResourceNotFoundException;
import com.musiccatalog.backend.repository.SavedAlbumRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibraryService {

    private final SavedAlbumRepository albumRepository;

    public LibraryService(SavedAlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    @Transactional(readOnly = true)
    public Page<AlbumResponse> getUserLibrary(User user, String search, String genre, Integer minRating, String sortBy, String sortDir, int page, int size) {
        List<SavedAlbum> albums = albumRepository.findByUser(user);

        // Filter by search query (title or artist)
        if (search != null && !search.isBlank()) {
            String query = search.toLowerCase();
            albums = albums.stream()
                    .filter(a -> a.getTitle().toLowerCase().contains(query) || a.getArtistName().toLowerCase().contains(query))
                    .collect(Collectors.toList());
        }

        // Filter by genre
        if (genre != null && !genre.isBlank() && !"all".equalsIgnoreCase(genre)) {
            albums = albums.stream()
                    .filter(a -> genre.equalsIgnoreCase(a.getGenre()))
                    .collect(Collectors.toList());
        }

        // Filter by min rating
        if (minRating != null && minRating > 0) {
            albums = albums.stream()
                    .filter(a -> a.getUserRating() != null && a.getUserRating() >= minRating)
                    .collect(Collectors.toList());
        }

        // Sorting
        Comparator<SavedAlbum> comparator = Comparator.comparing(SavedAlbum::getCreatedAt).reversed();
        if ("title".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(SavedAlbum::getTitle, String.CASE_INSENSITIVE_ORDER);
        } else if ("artist".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(SavedAlbum::getArtistName, String.CASE_INSENSITIVE_ORDER);
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing((SavedAlbum a) -> a.getUserRating() != null ? a.getUserRating() : 0);
        } else if ("releaseDate".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(SavedAlbum::getReleaseDate, Comparator.nullsLast(Comparator.naturalOrder()));
        }

        if ("asc".equalsIgnoreCase(sortDir)) {
            albums.sort(comparator);
        } else {
            albums.sort(comparator.reversed());
        }

        // Pagination
        int start = Math.min(page * size, albums.size());
        int end = Math.min(start + size, albums.size());
        List<AlbumResponse> pageContent = albums.subList(start, end).stream()
                .map(AlbumResponse::fromEntity)
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(page, size);
        return new PageImpl<>(pageContent, pageable, albums.size());
    }

    @Transactional
    public AlbumResponse saveAlbumToLibrary(User user, AlbumRequest request) {
        if (albumRepository.existsByAppleCatalogIdAndUser(request.getAppleCatalogId(), user)) {
            throw new BadRequestException("Album with catalog ID " + request.getAppleCatalogId() + " is already in your library");
        }

        SavedAlbum album = new SavedAlbum();
        album.setAppleCatalogId(request.getAppleCatalogId());
        album.setTitle(request.getTitle());
        album.setArtistName(request.getArtistName());
        album.setGenre(request.getGenre() != null ? request.getGenre() : "Unspecified");
        album.setReleaseDate(request.getReleaseDate());
        album.setTrackCount(request.getTrackCount() != null ? request.getTrackCount() : 0);
        album.setArtworkUrl(request.getArtworkUrl());
        album.setUserRating(request.getUserRating() != null ? request.getUserRating() : 3);
        album.setUserNotes(request.getUserNotes());
        album.setUser(user);

        SavedAlbum saved = albumRepository.save(album);
        return AlbumResponse.fromEntity(saved);
    }

    @Transactional
    public AlbumResponse updateAlbumInLibrary(User user, Long id, AlbumRequest request) {
        SavedAlbum album = albumRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found in your library with ID: " + id));

        if (request.getUserRating() != null) {
            album.setUserRating(request.getUserRating());
        }
        if (request.getUserNotes() != null) {
            album.setUserNotes(request.getUserNotes());
        }
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            album.setTitle(request.getTitle());
        }
        if (request.getGenre() != null && !request.getGenre().isBlank()) {
            album.setGenre(request.getGenre());
        }

        SavedAlbum updated = albumRepository.save(album);
        return AlbumResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteAlbumFromLibrary(User user, Long id) {
        SavedAlbum album = albumRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found in your library with ID: " + id));
        albumRepository.delete(album);
    }
}
