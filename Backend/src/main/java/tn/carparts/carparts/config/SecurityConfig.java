package tn.carparts.carparts.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor

public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowCredentials(true);
                    config.setAllowedOrigins(List.of("http://localhost:4200","http://84.247.131.212:8081"));
                    config.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization"));
                    config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/users/login",
                                "/users/register",
                                "/users/verify",
                                "/users/refresh-token",
                                "/users/resend-verification",
                                "/users/forgot-password/**"
                        ).permitAll()

                        // Public read‑only API – both with and without /api/v1 prefix
                        .requestMatchers(HttpMethod.GET, "/cars/**", "/api/v1/cars/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/acc/**", "/api/v1/acc/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**", "/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/designations/**", "/api/v1/designations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/parts/**", "/api/v1/parts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/acc-parts/**", "/api/v1/acc-parts/**").permitAll()

                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/users/me").authenticated()
                        .requestMatchers("/users/*/profile").authenticated()
                        .requestMatchers("/users/*/profile-picture").authenticated()
                        .requestMatchers("/users/*/update-profile").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }




    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:4200","http://84.247.131.212:8081"));

        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.ORIGIN,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.ACCEPT,
                HttpHeaders.AUTHORIZATION
        ));
        config.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "DELETE",
                "PUT",
                "PATCH"
        ));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);

    }

}