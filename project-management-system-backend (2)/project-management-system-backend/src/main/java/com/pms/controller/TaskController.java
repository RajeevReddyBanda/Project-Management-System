package com.pms.controller;

import com.pms.dto.TaskDTO;
import com.pms.entity.Task;
import com.pms.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(
            @RequestParam(required = false) Task.Status status,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false, defaultValue = "false") boolean overdue) {

        if (overdue) {
            return ResponseEntity.ok(taskService.getOverdueTasks());
        }
        if (status != null) {
            return ResponseEntity.ok(taskService.getTasksByStatus(status));
        }
        if (assigneeId != null) {
            return ResponseEntity.ok(taskService.getTasksByAssignee(assigneeId));
        }
        if (projectId != null) {
            return ResponseEntity.ok(taskService.getTasksByProject(projectId));
        }
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id,
                                               @Valid @RequestBody TaskDTO dto) {
        return ResponseEntity.ok(taskService.updateTask(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long id,
                                                     @RequestParam Task.Status status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
