package com.pms.service.impl;

import com.pms.dto.DashboardDTO;
import com.pms.dto.ProjectDTO;
import com.pms.dto.TaskDTO;
import com.pms.entity.Project;
import com.pms.entity.Task;
import com.pms.repository.ProjectRepository;
import com.pms.repository.TaskRepository;
import com.pms.repository.UserRepository;
import com.pms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectServiceImpl projectService;
    private final TaskServiceImpl taskService;

    @Override
    public DashboardDTO getDashboardStats() {
        // Task counts per priority
        Map<String, Long> tasksByPriority = new LinkedHashMap<>();
        for (Task.Priority p : Task.Priority.values()) {
            tasksByPriority.put(p.name(), taskRepository.findByPriority(p).size());
        }

        // Recent 5 projects and tasks
        List<ProjectDTO> recentProjects = projectRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream().map(projectService::toDTO).collect(Collectors.toList());

        List<TaskDTO> recentTasks = taskRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream().map(taskService::toDTO).collect(Collectors.toList());

        return DashboardDTO.builder()
                .totalProjects(projectRepository.count())
                .totalTasks(taskRepository.count())
                .totalUsers(userRepository.count())
                .completedProjects(projectRepository.countByStatus(Project.Status.COMPLETED))
                .inProgressProjects(projectRepository.countByStatus(Project.Status.IN_PROGRESS))
                .plannedProjects(projectRepository.countByStatus(Project.Status.PLANNED))
                .todoTasks(taskRepository.countByStatus(Task.Status.TODO))
                .inProgressTasks(taskRepository.countByStatus(Task.Status.IN_PROGRESS))
                .doneTasks(taskRepository.countByStatus(Task.Status.DONE))
                .overdueTasks(taskRepository.findOverdueTasks().size())
                .tasksByPriority(tasksByPriority)
                .recentProjects(recentProjects)
                .recentTasks(recentTasks)
                .build();
    }

    @Override
    public DashboardDTO getDashboardStatsByUser(Long userId) {
        List<ProjectDTO> userProjects = projectRepository.findByOwnerId(userId)
                .stream().map(projectService::toDTO).collect(Collectors.toList());

        List<TaskDTO> userTasks = taskRepository.findByAssigneeId(userId)
                .stream().map(taskService::toDTO).collect(Collectors.toList());

        long doneTasks = userTasks.stream().filter(t -> t.getStatus() == Task.Status.DONE).count();
        long inProgressTasks = userTasks.stream().filter(t -> t.getStatus() == Task.Status.IN_PROGRESS).count();
        long todoTasks = userTasks.stream().filter(t -> t.getStatus() == Task.Status.TODO).count();

        return DashboardDTO.builder()
                .totalProjects(userProjects.size())
                .totalTasks(userTasks.size())
                .totalUsers(userRepository.count())
                .doneTasks(doneTasks)
                .inProgressTasks(inProgressTasks)
                .todoTasks(todoTasks)
                .recentProjects(userProjects.stream().limit(5).collect(Collectors.toList()))
                .recentTasks(userTasks.stream().limit(5).collect(Collectors.toList()))
                .build();
    }
}
