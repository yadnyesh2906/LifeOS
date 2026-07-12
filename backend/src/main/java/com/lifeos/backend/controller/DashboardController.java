package com.lifeos.backend.controller;

import com.lifeos.backend.common.response.ApiResponse;
import com.lifeos.backend.dto.DashboardDTO;
import com.lifeos.backend.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // ===========================
    // Dashboard Summary
    // ===========================

    @GetMapping
    public ApiResponse<DashboardDTO> getDashboard() {

        return new ApiResponse<>(
                true,
                "Dashboard Retrieved Successfully",
                dashboardService.getDashboard()
        );
    }
}