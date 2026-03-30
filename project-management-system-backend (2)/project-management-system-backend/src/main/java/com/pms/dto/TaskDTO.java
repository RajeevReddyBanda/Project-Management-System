package com.pms.dto;

import com.pms.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TaskDTO {

    private Long id;

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private Task.Status status;

    private Task.Priority priority;

    private LocalDate dueDate;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private String projectName;

    private Long assigneeId;

    private String assigneeUsername;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
