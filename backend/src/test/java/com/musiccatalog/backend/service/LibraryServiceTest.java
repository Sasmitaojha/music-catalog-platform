package com.musiccatalog.backend.service;

import com.musiccatalog.backend.dto.AlbumRequest;
import com.musiccatalog.backend.dto.AlbumResponse;
import com.musiccatalog.backend.entity.SavedAlbum;
import com.musiccatalog.backend.entity.User;
import com.musiccatalog.backend.exception.BadRequestException;

import com.musiccatalog.backend.repository.SavedAlbumRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LibraryServiceTest {

    @Mock
    private SavedAlbumRepository albumRepository;

    @InjectMocks
    private LibraryService libraryService;

    private User testUser;
    private SavedAlbum testAlbum;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@example.com", "password123");
        testUser.setId(1L);

        testAlbum = new SavedAlbum();
        testAlbum.setId(10L);
        testAlbum.setAppleCatalogId(1440806041L);
        testAlbum.setTitle("Parachutes");
        testAlbum.setArtistName("Coldplay");
        testAlbum.setGenre("Alternative");
        testAlbum.setUserRating(5);
        testAlbum.setUser(testUser);
    }

    @Test
    void testSaveAlbumToLibrary_Success() {
        AlbumRequest request = new AlbumRequest();
        request.setAppleCatalogId(1440806041L);
        request.setTitle("Parachutes");
        request.setArtistName("Coldplay");
        request.setGenre("Alternative");
        request.setUserRating(5);

        when(albumRepository.existsByAppleCatalogIdAndUser(1440806041L, testUser)).thenReturn(false);
        when(albumRepository.save(any(SavedAlbum.class))).thenReturn(testAlbum);

        AlbumResponse result = libraryService.saveAlbumToLibrary(testUser, request);

        assertNotNull(result);
        assertEquals("Parachutes", result.getTitle());
        assertEquals("Coldplay", result.getArtistName());
        assertEquals(5, result.getUserRating());
        verify(albumRepository, times(1)).save(any(SavedAlbum.class));
    }

    @Test
    void testSaveAlbumToLibrary_DuplicateThrowsException() {
        AlbumRequest request = new AlbumRequest();
        request.setAppleCatalogId(1440806041L);

        when(albumRepository.existsByAppleCatalogIdAndUser(1440806041L, testUser)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> libraryService.saveAlbumToLibrary(testUser, request));
    }

    @Test
    void testGetUserLibrary_FilteringAndSorting() {
        when(albumRepository.findByUser(testUser)).thenReturn(List.of(testAlbum));

        Page<AlbumResponse> result = libraryService.getUserLibrary(testUser, "Coldplay", "Alternative", 4, "rating", "desc", 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Parachutes", result.getContent().get(0).getTitle());
    }
}
