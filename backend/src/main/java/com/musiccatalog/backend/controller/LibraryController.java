package com.musiccatalog.backend.controller;

import com.musiccatalog.backend.dto.AlbumRequest;
import com.musiccatalog.backend.dto.AlbumResponse;
import com.musiccatalog.backend.entity.User;
import com.musiccatalog.backend.service.AuthService;
import com.musiccatalog.backend.service.LibraryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;
    private final AuthService authService;

    public LibraryController(LibraryService libraryService, AuthService authService) {
        this.libraryService = libraryService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<Page<AlbumResponse>> getLibrary(
            Authentication authentication,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "genre", required = false) String genre,
            @RequestParam(name = "minRating", required = false) Integer minRating,
            @RequestParam(name = "sortBy", required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "sortDir", required = false, defaultValue = "desc") String sortDir,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {

        User currentUser = authService.getCurrentUser(authentication.getName());
        Page<AlbumResponse> libraryPage = libraryService.getUserLibrary(currentUser, search, genre, minRating, sortBy, sortDir, page, size);
        return ResponseEntity.ok(libraryPage);
    }

    @PostMapping
    public ResponseEntity<AlbumResponse> saveAlbum(
            Authentication authentication,
            @Valid @RequestBody AlbumRequest request) {

        User currentUser = authService.getCurrentUser(authentication.getName());
        AlbumResponse saved = libraryService.saveAlbumToLibrary(currentUser, request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlbumResponse> updateAlbum(
            Authentication authentication,
            @PathVariable(name = "id") Long id,
            @RequestBody AlbumRequest request) {

        User currentUser = authService.getCurrentUser(authentication.getName());
        AlbumResponse updated = libraryService.updateAlbumInLibrary(currentUser, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(
            Authentication authentication,
            @PathVariable(name = "id") Long id) {

        User currentUser = authService.getCurrentUser(authentication.getName());
        libraryService.deleteAlbumFromLibrary(currentUser, id);
        return ResponseEntity.noContent().build();
    }
}
