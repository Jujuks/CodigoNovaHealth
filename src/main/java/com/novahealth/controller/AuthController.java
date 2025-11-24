package com.novahealth.controller;

import com.novahealth.dto.AuthResponse;
import com.novahealth.dto.LoginRequest;
import com.novahealth.dto.RegisterRequest;
import com.novahealth.model.User;
import com.novahealth.security.JwtUtil;
import com.novahealth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = new User(request.getName(), request.getEmail(), request.getPassword(), request.getRole() != null ? request.getRole() : "PATIENT");
            User savedUser = userService.registerUser(user);
            System.out.println("User registered: " + savedUser.getEmail());
            return ResponseEntity.ok(new AuthResponse(null, "User registered successfully"));
        } catch (Exception e) {
            System.out.println("Registration failed: " + e.getMessage());
            return ResponseEntity.status(500).body(new AuthResponse(null, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtil.generateToken(request.getEmail());
            return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new AuthResponse(null, "Invalid credentials: " + e.getMessage()));
        }
    }
}