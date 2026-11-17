package com.gestionloyer.controller;

import com.gestionloyer.model.Locataire;
import com.gestionloyer.service.UtilisateurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LocataireController {

    private final UtilisateurService utilisateurService;

    public LocataireController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping("/locataires")
    public List<Locataire> listerLocataires() {
        return utilisateurService.listerLocataires();
    }
}
