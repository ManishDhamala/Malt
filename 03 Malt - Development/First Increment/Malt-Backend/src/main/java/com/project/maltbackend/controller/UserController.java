package com.project.maltbackend.controller;

import com.project.maltbackend.model.Address;
import com.project.maltbackend.model.User;
import com.project.maltbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> findUserByJwtToken(@RequestHeader("Authorization") String jwt) throws Exception {
        User user= userService.findUserByJwtToken(jwt);

        return new ResponseEntity<>(user, HttpStatus.OK);

    }

    @GetMapping("/saved-addresses")
    public ResponseEntity<List<Address>> getSavedAddresses(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Address> savedAddresses = user.getAddresses().stream()
                .filter(Address::isSavedAddress)
                .collect(Collectors.toList());

        System.out.println("User Addresses: " + user.getAddresses().size());
        System.out.println("Filtered Saved: " + savedAddresses.size());

        return ResponseEntity.ok(savedAddresses);
    }


}
