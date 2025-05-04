package com.project.maltbackend.service;


import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.UserRepository;
import com.project.maltbackend.util.TokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VerificationService {

    private static final Logger log = LoggerFactory.getLogger(VerificationService.class);

    @Value("${app.verification.token.expiry-minutes:1440}") // 24 hours default
    private int tokenExpiryMinutes;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void sendVerificationEmail(User user) {
        // Generate a new verification token
        String token = TokenUtil.generateVerificationToken();

        // Calculate the expiry date (24 hours from now)
        LocalDateTime expiryDate = TokenUtil.calculateExpiryDate(tokenExpiryMinutes);

        // Update the user with the token information
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(expiryDate);
        userRepository.save(user);

        // Create the verification URL
        String verificationUrl = baseUrl + "/auth/verify?token=" + token;

        // Load the verification email template
        String template = emailService.loadTemplate("verification.html");

        // Replace placeholders in the template
        String htmlContent = template
                .replace("[[name]]", user.getFullName())
                .replace("[[verificationUrl]]", verificationUrl);

        // Send the verification email
        emailService.sendHtmlEmail(
                user.getEmail(),
                "Please Verify Your Email Address",
                htmlContent
        );

        log.info("Verification email sent to: {}", user.getEmail());
        System.out.println("Verification email sent to: {}"+ user.getEmail());
    }

    public boolean verifyUser(String token) {
        User user = userRepository.findByVerificationToken(token);

        if (user == null) {
            log.warn("Verification failed: Invalid token");
            return false;
        }

        // Check if the token has expired
        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            log.warn("Verification failed: Token expired for user {}", user.getEmail());
            return false;
        }

        // Mark the user as verified
        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        log.info("User verified successfully: {}", user.getEmail());
        return true;
    }

    public void regenerateVerificationToken(String email) {
        User user = userRepository.findByEmail(email);

        if (user != null && !user.isVerified()) {
            sendVerificationEmail(user);
            log.info("Verification token regenerated for: {}", email);
        } else {
            log.warn("Token regeneration failed: User not found or already verified - {}", email);
        }
    }
}
