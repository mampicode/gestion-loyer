package com.gestionloyer.controller;

import com.gestionloyer.model.Paiement;
import com.gestionloyer.service.PaiementService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = "*")
public class PaiementController {

    private final PaiementService paiementService;

    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }

    @PostMapping("/contrat/{idContrat}")
    public Paiement enregistrer(@PathVariable Long idContrat, @RequestBody Paiement paiement) {
        return paiementService.enregistrer(idContrat, paiement);
    }

    @GetMapping
    public List<Paiement> lister() {
        return paiementService.lister();
    }

    @GetMapping("/contrat/{idContrat}")
    public List<Paiement> parContrat(@PathVariable Long idContrat) {
        return paiementService.listerParContrat(idContrat);
    }

    @GetMapping("/{id}")
    public Paiement getById(@PathVariable Long id) {
        return paiementService.trouverParId(id);
    }

    @GetMapping("/contrat/{idContrat}/solde")
    public Map<String, Object> solde(@PathVariable Long idContrat) {
        Map<String, Object> response = new HashMap<>();
        response.put("idContrat", idContrat);
        response.put("solde", paiementService.calculerSolde(idContrat));
        return response;
    }

    @PatchMapping("/{id}/annuler")
    public Paiement annuler(@PathVariable Long id) {
        return paiementService.annuler(id);
    }
}