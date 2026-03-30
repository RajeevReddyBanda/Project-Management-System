package com.pms.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardDTO {
    private long totalProjects;
    private long totalTasks;
    private long totalUsers;
    private long completedProjects;
    private long inProgressProjects;
    private long plannedProjects;
    private long todoTasks;
    private long inProgressTasks;
    private long doneTasks;
    private long overdueTasks;
    private Map<String, Long> tasksByPriority;
    private List<ProjectDTO> recentProjects;
    private List<TaskDTO> recentTasks;
}
