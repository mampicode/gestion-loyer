package com.gestionloyer.controller;

import com.gestionloyer.dto.*;
import com.gestionloyer.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register-locataire")
    public MessageResponse registerLocataire(@RequestBody RegisterLocataireRequest request) {
        return authService.creerCompteLocataire(request);
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PutMapping("/profil/{id}")
    public MessageResponse updateProfil(@PathVariable Long id,
                                        @RequestBody UpdateProfilRequest request) {
        return authService.updateProfil(id, request);
    }

    @PatchMapping("/statut/{id}")
    public MessageResponse changerStatut(@PathVariable Long id,
                                         @RequestParam String statut) {
        return authService.changerStatut(id, statut);
    }

}