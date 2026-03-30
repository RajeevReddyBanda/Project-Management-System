package com.pms.service;

import com.pms.dto.AuthResponse;
import com.pms.dto.LoginRequest;
import com.pms.dto.RegisterRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);
}
