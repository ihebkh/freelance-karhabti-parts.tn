package tn.carparts.carparts.DTO;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;
    private String phone;
    private String whatsapp;
}