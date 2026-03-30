package com.pms.service;

import com.pms.dto.UserDTO;
import com.pms.entity.User;

import java.util.List;

public interface UserService {

    List<UserDTO> getAllUsers();

    UserDTO getUserById(Long id);

    UserDTO getUserByUsername(String username);

    UserDTO updateUserRole(Long id, User.Role role);

    void deleteUser(Long id);

    UserDTO getCurrentUser(String username);
}
