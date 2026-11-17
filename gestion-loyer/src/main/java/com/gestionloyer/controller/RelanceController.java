package com.gestionloyer.controller;

import com.gestionloyer.model.Relance;
import com.gestionloyer.service.RelanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relances")
@CrossOrigin(origins = "*")
public class RelanceController {

    private final RelanceService relanceService;

    public RelanceController(RelanceService relanceService) {
        this.relanceService = relanceService;
    }

    @PostMapping("/impaye/{idImpaye}")
    public Relance creer(@PathVariable Long idImpaye) {
        return relanceService.creerRelance(idImpaye);
    }

    @GetMapping("/contrat/{idContrat}")
    public List<Relance> parContrat(@PathVariable Long idContrat) {
        return relanceService.listerParContrat(idContrat);
    }

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Relance> parUtilisateur(@PathVariable Long idUtilisateur) {
        return relanceService.listerParUtilisateur(idUtilisateur);
    }
}