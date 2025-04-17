package com.project.maltbackend.service;

import com.project.maltbackend.dto.UserDto;
import com.project.maltbackend.model.User;

public interface UserService {

    public UserDto updateUser(String jwt, UserDto userDto) throws Exception;

    public User findUserByJwtToken(String jwt) throws Exception;

    public User findUserByEmail(String email) throws Exception;

    public void deleteUser(Long userId) throws Exception;




}
