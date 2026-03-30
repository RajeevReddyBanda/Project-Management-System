package com.pms.service.impl;

import com.pms.dto.ProjectDTO;
import com.pms.entity.Project;
import com.pms.entity.User;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.ProjectRepository;
import com.pms.repository.UserRepository;
import com.pms.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findByIdWithTasks(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return toDTO(project);
    }

    @Override
    @Transactional
    public ProjectDTO createProject(ProjectDTO dto) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getOwnerId()));

        Project project = Project.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .status(dto.getStatus() != null ? dto.getStatus() : Project.Status.PLANNED)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .owner(owner)
                .build();

        return toDTO(projectRepository.save(project));
    }

    @Override
    @Transactional
    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());

        if (dto.getOwnerId() != null) {
            User owner = userRepository.findById(dto.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getOwnerId()));
            project.setOwner(owner);
        }

        return toDTO(projectRepository.save(project));
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        projectRepository.deleteById(id);
    }

    @Override
    public List<ProjectDTO> getProjectsByOwner(Long ownerId) {
        return projectRepository.findByOwnerId(ownerId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> getProjectsByStatus(Project.Status status) {
        return projectRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> searchProjects(String keyword) {
        return projectRepository.searchByKeyword(keyword).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO toDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        if (project.getOwner() != null) {
            dto.setOwnerId(project.getOwner().getId());
            dto.setOwnerUsername(project.getOwner().getUsername());
        }

        dto.setTaskCount(project.getTasks() != null ? project.getTasks().size() : 0);
        return dto;
    }
}
