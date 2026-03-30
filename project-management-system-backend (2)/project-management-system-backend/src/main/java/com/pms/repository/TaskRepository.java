package com.pms.repository;

import com.pms.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByStatus(Task.Status status);

    List<Task> findByPriority(Task.Priority priority);

    List<Task> findByProjectIdAndStatus(Long projectId, Task.Status status);

    long countByStatus(Task.Status status);

    long countByAssigneeId(Long assigneeId);

    long countByProjectId(Long projectId);

    @Query("SELECT t FROM Task t WHERE t.assignee.id = :userId AND t.status != 'DONE'")
    List<Task> findPendingTasksByUser(@Param("userId") Long userId);

    @Query("SELECT t FROM Task t WHERE t.dueDate < CURRENT_DATE AND t.status != 'DONE'")
    List<Task> findOverdueTasks();
}
