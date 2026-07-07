package com.civicmind.config;

import com.civicmind.security.CustomUserDetailsService;
import com.civicmind.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(allowedOrigins.split(","))
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC AUTH ENDPOINTS
                        // =========================
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // =========================
                        // H2 CONSOLE
                        // =========================
                        .requestMatchers(
                                "/h2-console/**"
                        ).permitAll()

                        // =========================
                        // CITIZEN ONLY
                        // =========================

                        // Citizen reports issue
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/issues"
                        ).hasRole("CITIZEN")

                        // Citizen sees own issues
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/issues/my"
                        ).hasRole("CITIZEN")

                        // Official sees only assigned issues
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/issues/assigned-to-me"
                        ).hasRole("OFFICIAL")

                        // =========================
                        // OFFICIAL + ADMIN
                        // =========================

                        // Dashboard: all issues
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/issues"
                        ).hasAnyRole(
                                "OFFICIAL",
                                "ADMIN"
                        )

                        // View one issue
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/issues/*"
                        ).hasAnyRole(
                                "OFFICIAL",
                                "ADMIN",
                                "CITIZEN"
                        )

                        // Filter issues by status
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/issues/status/**"
                        ).hasAnyRole(
                                "OFFICIAL",
                                "ADMIN"
                        )

                        // =========================
                        // ADMIN ASSIGNS ISSUE
                        // =========================
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/issues/*/assign"
                        ).hasRole("ADMIN")

                        // =========================
                        // OFFICIAL ONLY
                        // =========================

                        // Official updates status
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/issues/*/status"
                        ).hasRole("OFFICIAL")

                        // =========================
                        // ADMIN ONLY
                        // =========================

                        // Admin deletes issue
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/issues/*"
                        ).hasRole("ADMIN")

                        // Official account management
                        .requestMatchers(
                                "/api/officials/**"
                        ).hasRole("ADMIN")

                        // Admin endpoints
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // Everything else requires login
                        .anyRequest()
                        .authenticated()
                )

                .headers(headers ->
                        headers.frameOptions(
                                frame -> frame.disable()
                        )
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authenticationProvider(
                        authenticationProvider()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}