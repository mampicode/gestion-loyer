package com.gestionloyer.controller;

import com.gestionloyer.model.ContratLocation;
import com.gestionloyer.service.ContratService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@CrossOrigin(origins = "*")
public class ContratController {

    private final ContratService contratService;

    public ContratController(ContratService contratService) {
        this.contratService = contratService;
    }

    @PostMapping("/locataire/{idLocataire}/lot/{idLot}")
    public ContratLocation creer(@PathVariable Long idLocataire,
                                 @PathVariable Long idLot,
                                 @RequestBody ContratLocation contrat) {
        return contratService.creer(idLocataire, idLot, contrat);
    }

    @GetMapping
    public List<ContratLocation> lister() {
        return contratService.lister();
    }

    @GetMapping("/{id}")
    public ContratLocation getById(@PathVariable Long id) {
        return contratService.trouverParId(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));
    }

    @GetMapping("/locataire/{idLocataire}")
    public List<ContratLocation> parLocataire(@PathVariable Long idLocataire) {
        return contratService.listerParLocataire(idLocataire);
    }

    @PutMapping("/{id}")
    public ContratLocation modifier(@PathVariable Long id, @RequestBody ContratLocation contrat) {
        return contratService.modifier(id, contrat);
    }

    @PatchMapping("/{id}/resilier")
    public ContratLocation resilier(@PathVariable Long id) {
        return contratService.resilier(id);
    }

    @PatchMapping("/{id}/renouveler")
    public ContratLocation renouveler(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date nouvelleDateFin) {
        return contratService.renouveler(id, nouvelleDateFin);
    }
}