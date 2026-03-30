package com.pms.controller;

import com.pms.dto.DashboardDTO;
import com.pms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DashboardDTO> getDashboardByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getDashboardStatsByUser(userId));
    }
}
