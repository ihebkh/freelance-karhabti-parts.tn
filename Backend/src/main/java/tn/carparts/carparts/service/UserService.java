package tn.carparts.carparts.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.AuthResponse;
import tn.carparts.carparts.DTO.UpdateProfileRequest;
import tn.carparts.carparts.config.JwtService;
import tn.carparts.carparts.entity.PasswordResetToken;
import tn.carparts.carparts.entity.User;
import tn.carparts.carparts.enums.Role;
import tn.carparts.carparts.repository.PasswordResetTokenRepository;
import tn.carparts.carparts.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final FileUploadService fileUploadService;


    @Value("${app.frontend.url}")
    private String frontendUrl;
    public void register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);
        if (userRepository.count() == 0) {
            user.setRole(Role.SUPER_ADMIN);
        } else {
            user.setRole(Role.USER);
        }


        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationTokenExpiration(LocalDateTime.now().plusHours(24));

        userRepository.save(user);

        sendVerificationEmail(user);
    }

    public User updateProfileInfo(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setWhatsapp(request.getWhatsapp());

        return userRepository.save(user);
    }

    public void sendVerificationEmail(User user) {
        String url = frontendUrl + "/auth/verify?token=" + user.getVerificationToken();
        emailService.sendEmail(
                user.getEmail(),
                "Verify your Car-Parts account",
                "Click the link to verify your account: " + url
        );
    }

    public void resendVerificationEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getVerified()) {
            throw new RuntimeException("Account already verified");
        }

        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationTokenExpiration(LocalDateTime.now().plusHours(24));

        userRepository.save(user);
        sendVerificationEmail(user);
    }


    public boolean verifyAccount(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElse(null);

        if (user == null) return false;
        if (user.getVerificationTokenExpiration().isBefore(LocalDateTime.now())) return false;

        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiration(null);
        userRepository.save(user);

        return true;
    }

    public AuthResponse login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getVerified())
            throw new RuntimeException("Account not verified");

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid credentials");
        System.out.println("role: "+user.getRole()+" name: "+user.getRole().name());

        String accessToken = jwtService.generateAccessToken(user.getEmail(),user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(),user.getRole().name());

        return new AuthResponse(accessToken, refreshToken);
    }









    public User updateProfilePicture(Long userId, MultipartFile file) throws Exception {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        fileUploadService.delete( user.getProfilePicture());

        String filename = fileUploadService.upload(file, "pfp");

        user.setProfilePicture(filename);

        return userRepository.save(user);
    }



    @Transactional
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        PasswordResetToken resetToken = tokenRepository.findByUser(user)
                .orElseGet(PasswordResetToken::new);


        String token = UUID.randomUUID().toString();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));


        tokenRepository.save(resetToken);

        String url = frontendUrl + "/auth/forgot-password?token=" + token;
        emailService.sendEmail(
                user.getEmail(),
                "Reset your Car-Parts password",
                "Click the link to reset your password: " + url
        );
    }

    @Transactional
    public void completePasswordReset(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset link"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Reset link has expired");
        }


        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);


        tokenRepository.delete(resetToken);
    }


    @Transactional
    public Page<User> getAllUsers(Role role, int page) {

        Pageable pageable = PageRequest.of(page, 10);

        Page<Long> userIdsPage = userRepository.findUserIdsByRole(role, pageable);

        if (userIdsPage.isEmpty()) {
            return Page.empty();
        }

        List<User> users = userRepository.findUsersByIds(userIdsPage.getContent());

        // 3. Return the Page implementation
        return new PageImpl<>(users, pageable, userIdsPage.getTotalElements());
    }
    @Transactional
    public User updateUserRole(Long targetUserId, Role newRole, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("Requester not found"));


        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));


        if (requester.getRole() != Role.SUPER_ADMIN) {
            throw new RuntimeException("Permission denied: Only Super Admins can manage roles.");
        }

        if (targetUser.getId().equals(requester.getId()) && newRole != Role.SUPER_ADMIN) {
            throw new RuntimeException("Safety check: You cannot demote yourself from Super Admin.");
        }

        if (newRole == Role.SUPER_ADMIN && !targetUser.getRole().equals(Role.SUPER_ADMIN)) {
            throw new RuntimeException("There can only be one level of Super Admin.");
        }

        targetUser.setRole(newRole);
        return userRepository.save(targetUser);
    }
}