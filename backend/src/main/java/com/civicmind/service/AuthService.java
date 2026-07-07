package com.civicmind.service;

import com.civicmind.dto.AuthResponseDTO;
import com.civicmind.dto.LoginRequestDTO;
import com.civicmind.dto.RegisterRequestDTO;
import com.civicmind.model.entity.User;
import com.civicmind.model.enums.Role;
import com.civicmind.repository.UserRepository;
import com.civicmind.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.civicmind.security.CustomUserDetailsService userDetailsService;

    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
        .fullName(dto.getFullName())
        .email(dto.getEmail())
        .password(passwordEncoder.encode(dto.getPassword()))
        .role(Role.CITIZEN)
        .createdAt(java.time.LocalDateTime.now())
        .build();

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return AuthResponseDTO.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return AuthResponseDTO.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
