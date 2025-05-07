package com.project.maltbackend.config;

import com.project.maltbackend.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    // This method configures Spring Security's filter chain.
    // It defines how requests should be authorized, enables CORS, disables CSRF, and adds JWT validation.
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // Stateless session management: No session is maintained, every request must include authentication details.
        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization rules: Defines who can access which URLs
                .authorizeHttpRequests(Authorize -> Authorize

                        // Allow public access to authentication endpoints
                        .requestMatchers("/auth/signup").permitAll()
                        .requestMatchers("/auth/signin").permitAll()
                        .requestMatchers("/auth/verify").permitAll()  // Allow email verification
                        .requestMatchers("/auth/resend-verification").permitAll()  // Allow resending verification


                        // Allow public access to fetch all restaurants
                        .requestMatchers("/api/restaurants").permitAll()
                        .requestMatchers("/api/restaurants/**").permitAll() // Allow restaurant details access

                        // Allow public access to fetch all events endpoint
                        .requestMatchers("/api/events").permitAll()
                        .requestMatchers("/api/events/**").permitAll()

                        // Allow public access to fetch all categories associated with the restaurant
                        .requestMatchers("/api/category/restaurant/**").permitAll()

                        // Allow public access to fetch all food items associated with the restaurant
                        .requestMatchers("/api/food/restaurant/**").permitAll()

                        // Allow public access to search food
                        .requestMatchers("/api/food/search").permitAll()

                        // Allow WebSocket connections
                        .requestMatchers("/ws/**", "/topic/**", "/app/**").permitAll()

                        // URLs starting with /api/admin/** require roles of either RESTAURANT_OWNER or ADMIN
                        .requestMatchers("/api/admin/**").hasAnyRole("RESTAURANT_OWNER", "ADMIN")

                        //  Authentication is required for notifications
                        .requestMatchers("/api/notifications/**").authenticated()

                        // Any other /api/** URLs require authentication
                        .requestMatchers("/api/**").authenticated()

                        // All other requests are publicly accessible (no authentication needed)
                        .anyRequest().permitAll()
                )
                // Google Login
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo ->userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2LoginSuccessHandler)
                )

                // Add a custom filter to validate JWT tokens before Spring's default BasicAuthenticationFilter
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)

                // Disable CSRF(Cross-Site Request Forgery) protection since this is a stateless application (CSRF tokens are unnecessary with JWT)
                .csrf(csrf -> csrf.disable())

                // Enable CORS and apply the CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // Build and return the security configuration
        return http.build();
    }

    // This method configures Cross-Origin Resource Sharing (CORS)
    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {

            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();

                // Allow requests from the frontend running on localhost:3000 and 5173
                cfg.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));

                // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
                cfg.setAllowedMethods(Collections.singletonList("*"));

                // Allow credentials such as cookies or Authorization headers to be included in requests
                cfg.setAllowCredentials(true);

                // Allow all headers to be sent in requests
                cfg.setAllowedHeaders(Collections.singletonList("*"));

                // Expose the Authorization header so the frontend can access the JWT token
                cfg.setExposedHeaders(Arrays.asList("Authorization"));

                // Keep the response to the initial CORS request for 1 hour (3600 seconds).
                cfg.setMaxAge(3600L);

                return cfg;
            }
        };
    }

    // This method creates a PasswordEncoder that uses BCrypt to securely hash passwords.
    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    //Convert DTOs into entities automatically
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

}
