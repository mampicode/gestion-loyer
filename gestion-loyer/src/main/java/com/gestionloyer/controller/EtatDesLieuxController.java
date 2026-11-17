package com.gestionloyer.controller;

import com.gestionloyer.model.EtatDesLieux;
import com.gestionloyer.service.EtatDesLieuxService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etats-des-lieux")
@CrossOrigin(origins = "*")
public class EtatDesLieuxController {

    private final EtatDesLieuxService etatService;

    public EtatDesLieuxController(EtatDesLieuxService etatService) {
        this.etatService = etatService;
    }

    @PostMapping("/contrat/{idContrat}")
    public EtatDesLieux creer(@PathVariable Long idContrat, @RequestBody EtatDesLieux etat) {
        return etatService.creer(idContrat, etat);
    }

    @GetMapping("/contrat/{idContrat}")
    public List<EtatDesLieux> parContrat(@PathVariable Long idContrat) {
        return etatService.listerParContrat(idContrat);
    }

    @PutMapping("/{id}")
    public EtatDesLieux modifier(@PathVariable Long id, @RequestBody EtatDesLieux etat) {
        return etatService.modifier(id, etat);
    }
}