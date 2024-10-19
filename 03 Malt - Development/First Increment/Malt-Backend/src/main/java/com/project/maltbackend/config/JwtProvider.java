package com.project.maltbackend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class JwtProvider {

    // Create a secret key using the predefined secret from JwtConstant
    private SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    // Method to generate a JWT based on authentication information
    public String generateToken(Authentication auth) {
        // Get the user's authorities (roles)
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        // Convert authorities into a comma-separated string
        String roles = populateAuthorities(authorities);

        // Build the JWT with necessary claims and sign it
        String jwt = Jwts.builder()
                .setIssuedAt(new Date()) // Set the issue date to now
                .setExpiration(new Date(new Date().getTime() + 86400000)) // Set expiration to 1 day later
                .claim("email", auth.getName()) // Add the user's email as a claim (data inside the token)
                .claim("authorities", roles) // Add the user's roles as a claim
                .signWith(key) // Sign the JWT with the secret key
                .compact(); // Generate the final JWT string

        return jwt; // Return the generated JWT
    }

    // Method to extract the email from a given JWT
    public String getEmailFromJwtToken(String jwt) {
        jwt = jwt.substring(7); // Remove the "Bearer " prefix from the JWT

        // Parse the JWT using the secret key to retrieve claims
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        // Extract the email claim from the JWT
        String email = String.valueOf(claims.get("email"));

        return email; // Return the extracted email
    }

    // Helper method to convert a collection of GrantedAuthority into a comma-separated string
    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>(); // Use a set to store unique authorities

        // Loop through each authority and add it to the set
        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }

        // Join the authorities into a single string separated by commas
        return String.join(",", auths);
    }
}
