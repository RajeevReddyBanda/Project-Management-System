package com.pms.service;

import com.pms.dto.ProjectDTO;
import com.pms.entity.Project;

import java.util.List;

public interface ProjectService {

    List<ProjectDTO> getAllProjects();

    ProjectDTO getProjectById(Long id);

    ProjectDTO createProject(ProjectDTO dto);

    ProjectDTO updateProject(Long id, ProjectDTO dto);

    void deleteProject(Long id);

    List<ProjectDTO> getProjectsByOwner(Long ownerId);

    List<ProjectDTO> getProjectsByStatus(Project.Status status);

    List<ProjectDTO> searchProjects(String keyword);
}
