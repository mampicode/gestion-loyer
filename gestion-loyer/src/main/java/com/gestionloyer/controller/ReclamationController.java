package com.gestionloyer.controller;

import com.gestionloyer.model.Reclamation;
import com.gestionloyer.service.ReclamationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "*")
public class ReclamationController {

    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }

    @PostMapping("/locataire/{idLocataire}")
    public Reclamation creer(@PathVariable Long idLocataire,
                             @RequestParam(required = false) Long idLot,
                             @RequestBody Reclamation reclamation) {
        return reclamationService.creer(idLocataire, idLot, reclamation);
    }

    @GetMapping
    public List<Reclamation> lister() {
        return reclamationService.lister();
    }

    @GetMapping("/locataire/{idLocataire}")
    public List<Reclamation> parLocataire(@PathVariable Long idLocataire) {
        return reclamationService.parLocataire(idLocataire);
    }

    @PatchMapping("/{id}/statut")
    public Reclamation changerStatut(@PathVariable Long id, @RequestParam String statut) {
        return reclamationService.changerStatut(id, statut);
    }
}