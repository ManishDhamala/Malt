package com.project.maltbackend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

//OncePerRequestFilter: This ensures the filter is executed once for each HTTP request.
public class JwtTokenValidator extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Retrieve the JWT token from the request header
        String jwt = request.getHeader(JwtConstant.JWT_HEADER);


        // Check if the JWT token is present and valid (starts with "Bearer ")
        if(jwt != null){
            // Remove the "Bearer " prefix to extract the actual token
            jwt = jwt.substring(7);

            try{
                // Create a secret key based on our pre-defined secret from JwtConstant
                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

                // Now we use the secret key to parse the token and extract the claims (data inside the token)
                Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();

                // From the claims, extract the user's email and authorities (roles/permissions)
                String email = String.valueOf(claims.get("email"));
                String authorities = String.valueOf((claims.get("authorities")));

                // Converting the authorities (e.g., ROLE_CUSTOMER, ROLE_ADMIN) into GrantedAuthority list
                List<GrantedAuthority> auth = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

                // Setting up an authentication object with the user's email and authorities
                Authentication authentication = new UsernamePasswordAuthenticationToken(email,null, auth);

                // Now we store this authentication info in the security context, so the user is authenticated
                SecurityContextHolder.getContext().setAuthentication(authentication);

            }catch (Exception e){
                throw new BadCredentialsException("Invalid JWT token");
            }
        }

        // After processing the token (if present), pass the request along the filter chain
        filterChain.doFilter(request,response);


    }
}
