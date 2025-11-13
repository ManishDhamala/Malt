package com.project.maltbackend.service;

import com.project.maltbackend.model.USER_ROLE;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // This method retrieves the user's information based on their email
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);  //username = email
        if(user == null){
            throw new UsernameNotFoundException("User not found with email"+username);
        }

        USER_ROLE role = user.getRole();

        // Create a list to hold the user's granted authorities (roles/permission)
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Convert the user's role to a string and add it as a SimpleGrantedAuthority
        authorities.add(new SimpleGrantedAuthority(role.toString()));

        // Return a Spring Security User object containing the user's email, password, and authorities
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }
}
