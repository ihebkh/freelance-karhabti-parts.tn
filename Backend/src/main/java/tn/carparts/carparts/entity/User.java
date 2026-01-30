package tn.carparts.carparts.entity;

import lombok.*;

import jakarta.persistence.*;
import tn.carparts.carparts.enums.Role;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String username;

    @Column(unique = true)
    private String email;

    private String password;

    private String profilePicture;

    private Boolean verified;

    private String verificationToken;

    private LocalDateTime verificationTokenExpiration;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;


    private String phone;
    private String whatsapp;
}