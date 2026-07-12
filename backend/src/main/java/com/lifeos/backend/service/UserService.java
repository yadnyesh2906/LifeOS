package com.lifeos.backend.service;

import com.lifeos.backend.dto.*;

public interface UserService {

    UserDTO register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void changePassword(ChangePasswordRequest request);


    UserDTO getProfile();

    ProfileUpdateResponse updateProfile(UserDTO dto);

}