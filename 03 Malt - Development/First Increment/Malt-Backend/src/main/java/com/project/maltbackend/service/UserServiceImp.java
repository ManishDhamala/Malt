package com.project.maltbackend.service;

import com.project.maltbackend.config.JwtProvider;
import com.project.maltbackend.dto.UserDto;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;

    private final JwtProvider jwtProvider;

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

    // Method to delete user by Id
    @Override
    public void deleteUser(Long userId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        userRepository.deleteById(userId);
    }


}
