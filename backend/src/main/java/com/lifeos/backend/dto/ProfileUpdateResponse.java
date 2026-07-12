package com.lifeos.backend.dto;

public class ProfileUpdateResponse {

    private String token;

    private UserDTO user;

    public ProfileUpdateResponse() {
    }

    public ProfileUpdateResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}