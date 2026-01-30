package tn.carparts.carparts.controller;


import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.AuthResponse;
import tn.carparts.carparts.DTO.UpdateProfileRequest;
import tn.carparts.carparts.config.JwtService;
import tn.carparts.carparts.entity.User;
import tn.carparts.carparts.enums.Role;
import tn.carparts.carparts.repository.UserRepository;
import tn.carparts.carparts.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    private final UserService userService;
    private final JwtService jwtService;
    @Value("${application.file.uploads.photos-output-path}")
    private String uploadDir;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        userService.register(user);
        return Map.of("message", "Registration successful. Check your email to verify your account.");
    }
    @PutMapping("/{id}/profile")
    public User updateProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateProfileInfo(id, request);
    }


    @PostMapping("/resend-verification")
    public void resendVerification(@RequestParam String email) {
        userService.resendVerificationEmail(email);
    }



    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestParam String token) {
        boolean result = userService.verifyAccount(token);

        if (result) {
            return ResponseEntity.ok(Map.of("message", "Account verified."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired token."));
        }
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestParam String email, @RequestParam String password) {
        return userService.login(email, password);
    }

    @PostMapping("/refresh-token")
    public AuthResponse refreshToken(@RequestParam String refreshToken) {

        if (!jwtService.isTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(newAccessToken, refreshToken);
    }




    @GetMapping("/profile-picture/{userId}")
    public ResponseEntity<Resource> getProfilePicture(
            @PathVariable Long userId,
            Authentication authentication
    ) throws Exception {

        String email = authentication.getName();
        System.out.println("email:"+email);
        User requester = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!requester.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Path filePath = Paths.get(uploadDir).resolve(user.getProfilePicture());
        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(resource);
    }

    @PostMapping("/forgot-password/request")
    public ResponseEntity<?> requestReset(@RequestParam String email) {
        userService.initiatePasswordReset(email);
        return ResponseEntity.ok(Map.of("message", "If an account exists with this email, a reset link has been sent."));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        userService.completePasswordReset(token, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }





    @PostMapping(
            value = "/{id}/profile-picture",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public User updateProfilePicture(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        return userService.updateProfilePicture(id, file);
    }



    @GetMapping("/me")
    public User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }




    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public Page<User> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page
    ) {
        return userService.getAllUsers(role, page);
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> updateRole(
            @PathVariable Long id,
            @RequestParam Role role,
            Authentication authentication
    ) {
        User updatedUser = userService.updateUserRole(id, role, authentication.getName());
        return ResponseEntity.ok(updatedUser);
    }
}