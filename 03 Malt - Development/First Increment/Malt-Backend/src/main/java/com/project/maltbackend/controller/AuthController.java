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
import com.project.maltbackend.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtProvider jwtProvider;

    private final CustomerUserDetailsService customerUserDetailsService;

    private final CartRepository cartRepository;

    private final EmailService emailService;

    private final NotificationService notificationService;

    private final VerificationService verificationService;

    // Added to customize the verification requirement
    @Value("${app.verification.required:true}")
    private boolean verificationRequired;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {

        User isEmailExist = userRepository.findByEmail(user.getEmail());
        if (isEmailExist != null) {
            throw new Exception("Email is already used");
        }

        User createdUser = new User();
        createdUser.setEmail(user.getEmail());
        createdUser.setFullName(user.getFullName());
        createdUser.setRole(user.getRole());
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));

        // User starts as unverified if verification is required
        if (verificationRequired) {
            createdUser.setVerified(false);
        } else {
            createdUser.setVerified(true);
        }

        User savedUser = userRepository.save(createdUser);

        if (user.getRole() == USER_ROLE.ROLE_CUSTOMER) {
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
        authResponse.setMessage(verificationRequired
                ? "Registered Successfully. Please check your email to verify your account."
                : "Registered Successfully");
        authResponse.setRole(savedUser.getRole());

        if ((user.getRole() == USER_ROLE.ROLE_CUSTOMER) || (user.getRole() == USER_ROLE.ROLE_RESTAURANT_OWNER)) {
            if (verificationRequired) {
                // Send verification email
                verificationService.sendVerificationEmail(savedUser);
            } else {
                // Send welcome email
                String template = emailService.loadTemplate("welcome.html");
                String htmlContent = template.replace("[[name]]", user.getFullName());
                emailService.sendHtmlEmail(user.getEmail(), "Welcome to Malt!", htmlContent);
            }
        }

        // Return the response with HTTP status 201 (Created)
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signInHandler(@RequestBody LoginRequest loginRequest) throws Exception {
        // Extract the username (email) and password from the login request
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Then authenticate the user using the provided username and password
        Authentication authentication = authenticate(username, password);

        // check if user exists and is verified when verification is required
        if (verificationRequired) {
            User user = userRepository.findByEmail(username);
            if (user != null && !user.isVerified()) {
                throw new BadCredentialsException("Email not verified. Please check your email for verification link..");
            }
        }

        // Rest of the method remains unchanged
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successfully");
        authResponse.setRole(USER_ROLE.valueOf(role));

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    // Endpoint to verify user's email address
    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam String token) {
        boolean verified = verificationService.verifyUser(token);

        if (verified) {
            return ResponseEntity.ok("Email verified successfully. You can now login to your account.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired verification link.");
        }
    }


    // Endpoint to resend verification email
    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestParam String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.badRequest().body("No account found with this email address.");
        }

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("This account is already verified.");
        }

        verificationService.sendVerificationEmail(user);
        return ResponseEntity.ok("Verification email has been sent. Please check your inbox.");
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
