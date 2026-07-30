package com.musiccatalog.backend.repository;

import com.musiccatalog.backend.entity.SavedAlbum;
import com.musiccatalog.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedAlbumRepository extends JpaRepository<SavedAlbum, Long> {
    List<SavedAlbum> findByUser(User user);
    Page<SavedAlbum> findByUser(User user, Pageable pageable);
    Optional<SavedAlbum> findByIdAndUser(Long id, User user);
    Optional<SavedAlbum> findByAppleCatalogIdAndUser(Long appleCatalogId, User user);
    boolean existsByAppleCatalogIdAndUser(Long appleCatalogId, User user);
    void deleteByIdAndUser(Long id, User user);
}
