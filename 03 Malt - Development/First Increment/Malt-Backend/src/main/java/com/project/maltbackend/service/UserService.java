package com.project.maltbackend.service;

import com.project.maltbackend.model.User;

public interface UserService {

    public User findUserByJwtToken(String jwt) throws Exception;

    public User findUserByEmail(String email) throws Exception;



}
