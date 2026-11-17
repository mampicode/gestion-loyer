package com.gestionloyer.controller;

import com.gestionloyer.model.HistoriqueConnexion;
import com.gestionloyer.model.Utilisateur;
import com.gestionloyer.service.UtilisateurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    public List<Utilisateur> lister() {
        return utilisateurService.listerTous();
    }

    @GetMapping("/{id}")
    public Utilisateur getById(@PathVariable Long id) {
        return utilisateurService.trouverParId(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @GetMapping("/historique")
    public List<HistoriqueConnexion> historiqueTous() {
        return utilisateurService.historiqueTous();
    }

    @GetMapping("/{id}/historique")
    public List<HistoriqueConnexion> historiqueUtilisateur(@PathVariable Long id) {
        return utilisateurService.historiqueParUtilisateur(id);
    }
}