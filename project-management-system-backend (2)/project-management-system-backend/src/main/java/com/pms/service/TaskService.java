package com.pms.service;

import com.pms.dto.TaskDTO;
import com.pms.entity.Task;

import java.util.List;

public interface TaskService {

    List<TaskDTO> getAllTasks();

    TaskDTO getTaskById(Long id);

    TaskDTO createTask(TaskDTO dto);

    TaskDTO updateTask(Long id, TaskDTO dto);

    void deleteTask(Long id);

    List<TaskDTO> getTasksByProject(Long projectId);

    List<TaskDTO> getTasksByAssignee(Long assigneeId);

    List<TaskDTO> getTasksByStatus(Task.Status status);

    TaskDTO updateTaskStatus(Long id, Task.Status status);

    List<TaskDTO> getOverdueTasks();
}
