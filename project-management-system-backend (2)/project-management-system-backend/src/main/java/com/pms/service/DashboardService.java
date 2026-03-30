package com.pms.service;

import com.pms.dto.DashboardDTO;

public interface DashboardService {

    DashboardDTO getDashboardStats();

    DashboardDTO getDashboardStatsByUser(Long userId);
}
