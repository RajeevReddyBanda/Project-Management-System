package com.pms.controller;

import com.pms.dto.ProjectDTO;
import com.pms.dto.TaskDTO;
import com.pms.entity.Project;
import com.pms.service.ProjectService;
import com.pms.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects(
            @RequestParam(required = false) Project.Status status,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(projectService.searchProjects(search));
        }
        if (status != null) {
            return ResponseEntity.ok(projectService.getProjectsByStatus(status));
        }
        if (ownerId != null) {
            return ResponseEntity.ok(projectService.getProjectsByOwner(ownerId));
        }
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id,
                                                     @Valid @RequestBody ProjectDTO dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskDTO>> getProjectTasks(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTasksByProject(id));
    }
}
