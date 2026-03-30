package com.pms.dto;

import com.pms.entity.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    private Project.Status status;

    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    private String ownerUsername;

    private int taskCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
