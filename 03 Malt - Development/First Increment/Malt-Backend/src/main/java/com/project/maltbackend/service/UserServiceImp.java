package com.project.maltbackend.service;

import com.project.maltbackend.config.JwtProvider;
import com.project.maltbackend.dto.UserDto;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public UserDto updateUser(String jwt, UserDto userDto) throws Exception {
        User user = findUserByJwtToken(jwt);

        if (userDto.getFullName() != null) {
            user.setFullName(userDto.getFullName());
        }

        User updatedUser = userRepository.save(user);

        // Convert back to DTO before returning
        return new UserDto(updatedUser.getId(), updatedUser.getFullName(), updatedUser.getEmail(), updatedUser.getRole());
    }


    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user= findUserByEmail(email);
        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if(user == null){
            throw new Exception("User not found");
        }
        return user;
    }



}
