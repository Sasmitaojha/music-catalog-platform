package com.musiccatalog.backend.controller;

import com.musiccatalog.backend.dto.AnalyticsResponse;
import com.musiccatalog.backend.entity.User;
import com.musiccatalog.backend.service.AnalyticsService;
import com.musiccatalog.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AuthService authService;

    public AnalyticsController(AnalyticsService analyticsService, AuthService authService) {
        this.analyticsService = analyticsService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(Authentication authentication) {
        User currentUser = authService.getCurrentUser(authentication.getName());
        AnalyticsResponse analytics = analyticsService.getUserAnalytics(currentUser);
        return ResponseEntity.ok(analytics);
    }
}
