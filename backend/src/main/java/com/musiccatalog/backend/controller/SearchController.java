package com.musiccatalog.backend.controller;

import com.musiccatalog.backend.service.ItunesSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final ItunesSearchService searchService;

    public SearchController(ItunesSearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(name = "query") String query,
            @RequestParam(name = "type", required = false, defaultValue = "album") String type,
            @RequestParam(name = "limit", required = false, defaultValue = "25") Integer limit) {

        Map<String, Object> results = searchService.searchCatalog(query, type, limit);
        return ResponseEntity.ok(results);
    }
}
