package com.project.maltbackend.controller;

import com.project.maltbackend.config.JwtProvider;
import com.project.maltbackend.model.Cart;
import com.project.maltbackend.model.USER_ROLE;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.CartRepository;
import com.project.maltbackend.repository.UserRepository;
import com.project.maltbackend.request.LoginRequest;
import com.project.maltbackend.response.AuthResponse;
import com.project.maltbackend.service.CustomerUserDetailsService;
import com.project.maltbackend.service.EmailService;
import com.project.maltbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

//    @PostMapping("/signup")
//    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {
//
//        User isEmailExist = userRepository.findByEmail(user.getEmail());
//        if(isEmailExist != null){
//            throw new Exception("Email is already used");
//        }
//
//        User createdUser = new User();
//        createdUser.setEmail(user.getEmail());
//        createdUser.setFullName(user.getFullName());
//        createdUser.setRole(user.getRole());
//        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
//
//        User savedUser = userRepository.save(createdUser);
//
//        if(user.getRole() == USER_ROLE.ROLE_CUSTOMER) {
//            // Create welcome notification
//            notificationService.createWelcomeNotification(savedUser);
//        }
//
//        // Create a cart for the new user and save it in the database
//        Cart cart = new Cart();
//        cart.setCustomer(savedUser);
//        cartRepository.save(cart);
//
//        // Authenticate the new user by creating an authentication token using their email and password
//        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
//        SecurityContextHolder.getContext().setAuthentication(authentication);  // Set the authentication in the SecurityContext
//
//        // Generate a JWT token for the authenticated user
//        String jwt = jwtProvider.generateToken(authentication);
//
//        // Create an AuthResponse object with the JWT token, success message, and the user's role
//        AuthResponse authResponse = new AuthResponse();
//        authResponse.setJwt(jwt);
//        authResponse.setMessage("Registered Successfully");
//        authResponse.setRole(savedUser.getRole());
//
//        if(user.getRole() == USER_ROLE.ROLE_CUSTOMER) {
//            // Loading welcome.html template
//            String template = emailService.loadTemplate("welcome.html");
//            String htmlContent = template.replace("[[name]]", user.getFullName()); // Replacing name in HTML Content
//
//            //Sending Register / Welcome Mail to User
//            emailService.sendHtmlEmail(user.getEmail(), "Welcome to Malt!", htmlContent);
//        }
//
//
//        // Return the response with HTTP status 201 (Created)
//        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
//
//    }


    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {

        User isEmailExist = userRepository.findByEmail(user.getEmail());
        if(isEmailExist != null){
            throw new Exception("Email is already used");
        }

        User createdUser = new User();
        createdUser.setEmail(user.getEmail());
        createdUser.setFullName(user.getFullName());
        createdUser.setRole(user.getRole());
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(createdUser);

        if(user.getRole() == USER_ROLE.ROLE_CUSTOMER) {
            // Create welcome notification
            notificationService.createWelcomeNotification(savedUser);
        }

        // Create a cart for the new user and save it in the database
        Cart cart = new Cart();
        cart.setCustomer(savedUser);
        cartRepository.save(cart);

        // Load user details to get proper authorities
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(savedUser.getEmail());

        // Create authenticated token with proper authorities
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        // Set the authentication in the SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate a JWT token for the authenticated user
        String jwt = jwtProvider.generateToken(authentication);

        // Create an AuthResponse object with the JWT token, success message, and the user's role
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Registered Successfully");
        authResponse.setRole(savedUser.getRole());

        if(user.getRole() == USER_ROLE.ROLE_CUSTOMER) {
            // Loading welcome.html template
            String template = emailService.loadTemplate("welcome.html");
            String htmlContent = template.replace("[[name]]", user.getFullName()); // Replacing name in HTML Content

            //Sending Register / Welcome Mail to User
            emailService.sendHtmlEmail(user.getEmail(), "Welcome to Malt!", htmlContent);
        }

        // Return the response with HTTP status 201 (Created)
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signInHandler(@RequestBody LoginRequest loginRequest) throws Exception {

        // Extract the username (email) and password from the login request
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Authenticate the user using the provided username and password
        Authentication authentication = authenticate(username, password);

        // Retrieve the user's authorities (roles) from the authentication object
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();  // Get the first role

        // Generate a JWT token for the authenticated user
        String jwt = jwtProvider.generateToken(authentication);

        // Create an AuthResponse object with the JWT token, success message, and the user's role
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successfully");
        authResponse.setRole(USER_ROLE.valueOf(role));  // Convert the role string to USER_ROLE enum


        // Return the response with HTTP status 200 (OK)
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    // Private method to authenticate a user by their username and password
    private Authentication authenticate(String username, String password) {
        // Load the user details (username, password, roles) using the custom UserDetailsService
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

        // Check if the user exists, if not, throw an exception for invalid username
        if (userDetails == null) {
            System.out.println("Login failed: Invalid Username");
            throw new BadCredentialsException("Invalid Username");
        }

        // Validate the password by comparing the provided password with the stored (hashed) password
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {  // If passwords do not match, throw an exception
            System.out.println("Login failed: Invalid Username or Password");
            throw new BadCredentialsException("Invalid Username or Password");
        }

        // Return an authenticated token containing the user's details and authorities (roles)
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }



}
