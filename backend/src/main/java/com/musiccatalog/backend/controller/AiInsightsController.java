package com.musiccatalog.backend.controller;

import com.musiccatalog.backend.dto.AiInsightRequest;
import com.musiccatalog.backend.dto.AiInsightResponse;
import com.musiccatalog.backend.entity.User;
import com.musiccatalog.backend.service.AiInsightsService;
import com.musiccatalog.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiInsightsController {

    private final AiInsightsService aiInsightsService;
    private final AuthService authService;

    public AiInsightsController(AiInsightsService aiInsightsService, AuthService authService) {
        this.aiInsightsService = aiInsightsService;
        this.authService = authService;
    }

    @PostMapping("/insights")
    public ResponseEntity<AiInsightResponse> getInsights(
            Authentication authentication,
            @RequestBody AiInsightRequest request) {

        User currentUser = authService.getCurrentUser(authentication.getName());
        AiInsightResponse insight = aiInsightsService.generateInsight(currentUser, request);
        return ResponseEntity.ok(insight);
    }
}
