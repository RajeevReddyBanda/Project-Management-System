package com.pms.dto;

import com.pms.entity.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private User.Role role;
    private LocalDateTime createdAt;
    private int ownedProjectsCount;
    private int assignedTasksCount;
}
