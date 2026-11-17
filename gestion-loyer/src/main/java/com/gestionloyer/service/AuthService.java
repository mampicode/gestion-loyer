package com.gestionloyer.service;

import com.gestionloyer.dto.AuthResponse;
import com.gestionloyer.dto.LoginRequest;
import com.gestionloyer.model.HistoriqueConnexion;
import com.gestionloyer.model.Utilisateur;
import com.gestionloyer.repository.HistoriqueConnexionRepository;
import com.gestionloyer.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import com.gestionloyer.model.CodeOTP;
import com.gestionloyer.model.Locataire;
import com.gestionloyer.model.Role;
import com.gestionloyer.repository.CodeOTPRepository;
import com.gestionloyer.repository.LocataireRepository;
import com.gestionloyer.repository.RoleRepository;
import com.gestionloyer.dto.*;


import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final HistoriqueConnexionRepository historiqueConnexionRepository;
    private final RoleRepository roleRepository;
    private final LocataireRepository locataireRepository;
    private final CodeOTPRepository codeOTPRepository;
    private final EmailService emailService;

    public AuthService(UtilisateurRepository utilisateurRepository,
                       HistoriqueConnexionRepository historiqueConnexionRepository,
                       RoleRepository roleRepository,
                       LocataireRepository locataireRepository,
                       CodeOTPRepository codeOTPRepository,
                       EmailService emailService) {
        this.utilisateurRepository = utilisateurRepository;
        this.historiqueConnexionRepository = historiqueConnexionRepository;
        this.roleRepository = roleRepository;
        this.locataireRepository = locataireRepository;
        this.codeOTPRepository = codeOTPRepository;
        this.emailService = emailService;
    }


    public AuthResponse login(LoginRequest request) {
        Optional<Utilisateur> optionalUser =
                utilisateurRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return new AuthResponse(null, null, null, null, null, "Email ou mot de passe incorrect");
        }

        Utilisateur user = optionalUser.get();

        // Pour l'instant comparaison simple.
        // Plus tard on utilisera BCrypt.
        if (!user.getMotDePasse().equals(request.getMotDePasse())) {
            enregistrerHistorique(user, "N");
            return new AuthResponse(null, null, null, null, null, "Email ou mot de passe incorrect");
        }

        if (!"ACTIF".equalsIgnoreCase(user.getStatut())) {
            return new AuthResponse(null, null, null, null, null, "Compte désactivé");
        }

        user.setDerniereConnexion(new Date());
        utilisateurRepository.save(user);

        enregistrerHistorique(user, "O");

        return new AuthResponse(
                user.getIdUtilisateur(),
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getRole().getLibelle(),
                "Connexion réussie"
        );
    }

    public MessageResponse creerCompteLocataire(RegisterLocataireRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            return new MessageResponse("Cet email existe déjà");
        }

        Role roleLocataire = roleRepository.findByLibelle("LOCATAIRE")
                .orElseThrow(() -> new RuntimeException("Rôle LOCATAIRE introuvable"));

        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setTelephone(request.getTelephone());
        user.setMotDePasse("123456"); // mot de passe temporaire
        user.setStatut("ACTIF");
        user.setRole(roleLocataire);
        utilisateurRepository.save(user);

        Locataire locataire = new Locataire();
        locataire.setUtilisateur(user);
        locataire.setAdresse(request.getAdresse());
        locataire.setPieceIdentite(request.getPieceIdentite());
        locataireRepository.save(locataire);

        return new MessageResponse("Compte locataire créé avec succès. Mot de passe temporaire : 123456");
    }

    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<Utilisateur> optionalUser = utilisateurRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return new MessageResponse("Aucun compte trouvé avec cet email");
        }

        Utilisateur user = optionalUser.get();
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);

        CodeOTP otp = new CodeOTP();
        otp.setCode(code);
        otp.setTypeOtp("RESET");
        otp.setUtilise("N");
        otp.setUtilisateur(user);

        // expiration dans 10 minutes
        Date expiration = new Date(System.currentTimeMillis() + 10 * 60 * 1000);
        otp.setDateExpiration(expiration);
        codeOTPRepository.save(otp);

        emailService.sendOtpEmail(user.getEmail(), code);
        return new MessageResponse("Un code de réinitialisation a été envoyé à votre email");
    }

    public MessageResponse resetPassword(ResetPasswordRequest request) {
        Optional<Utilisateur> optionalUser = utilisateurRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return new MessageResponse("Utilisateur introuvable");
        }

        Utilisateur user = optionalUser.get();

        Optional<CodeOTP> optionalOtp = codeOTPRepository
                .findByCodeAndUtilise(request.getCodeOtp(), "N");

        if (optionalOtp.isEmpty()) {
            return new MessageResponse("Code OTP invalide");
        }

        CodeOTP otp = optionalOtp.get();

        if (!otp.getUtilisateur().getIdUtilisateur().equals(user.getIdUtilisateur())) {
            return new MessageResponse("Code OTP invalide pour cet utilisateur");
        }

        if (otp.getDateExpiration().before(new Date())) {
            return new MessageResponse("Code OTP expiré");
        }

        user.setMotDePasse(request.getNouveauMotDePasse());
        utilisateurRepository.save(user);

        otp.setUtilise("O");
        codeOTPRepository.save(otp);

        return new MessageResponse("Mot de passe réinitialisé avec succès");
    }

    public MessageResponse updateProfil(Long idUtilisateur, UpdateProfilRequest request) {
        Optional<Utilisateur> optionalUser = utilisateurRepository.findById(idUtilisateur);
        if (optionalUser.isEmpty()) {
            return new MessageResponse("Utilisateur introuvable");
        }

        Utilisateur user = optionalUser.get();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setTelephone(request.getTelephone());
        utilisateurRepository.save(user);

        return new MessageResponse("Profil mis à jour");
    }

    public MessageResponse changerStatut(Long idUtilisateur, String statut) {
        Optional<Utilisateur> optionalUser = utilisateurRepository.findById(idUtilisateur);
        if (optionalUser.isEmpty()) {
            return new MessageResponse("Utilisateur introuvable");
        }

        Utilisateur user = optionalUser.get();
        user.setStatut(statut);
        utilisateurRepository.save(user);

        return new MessageResponse("Statut mis à jour : " + statut);
    }


    private void enregistrerHistorique(Utilisateur user, String succes) {
        HistoriqueConnexion historique = new HistoriqueConnexion();
        historique.setUtilisateur(user);
        historique.setSucces(succes);
        historique.setDateConnexion(new Date());
        historiqueConnexionRepository.save(historique);
    }




}