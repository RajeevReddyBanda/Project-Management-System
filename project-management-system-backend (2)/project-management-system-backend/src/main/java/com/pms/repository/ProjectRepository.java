package com.pms.repository;

import com.pms.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwnerId(Long ownerId);

    List<Project> findByStatus(Project.Status status);

    @Query("SELECT p FROM Project p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Project> searchByKeyword(@Param("keyword") String keyword);

    long countByStatus(Project.Status status);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.id = :id")
    java.util.Optional<Project> findByIdWithTasks(@Param("id") Long id);
}
