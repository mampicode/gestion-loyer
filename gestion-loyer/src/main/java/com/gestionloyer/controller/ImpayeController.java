package com.gestionloyer.controller;

import com.gestionloyer.model.Impaye;
import com.gestionloyer.service.ImpayeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/impayes")
@CrossOrigin(origins = "*")
public class ImpayeController {

    private final ImpayeService impayeService;

    public ImpayeController(ImpayeService impayeService) {
        this.impayeService = impayeService;
    }

    @PostMapping("/contrat/{idContrat}")
    public Impaye creer(@PathVariable Long idContrat, @RequestBody Impaye impaye) {
        return impayeService.creer(idContrat, impaye);
    }

    @GetMapping
    public List<Impaye> lister() {
        return impayeService.lister();
    }

    @GetMapping("/en-cours")
    public List<Impaye> enCours() {
        return impayeService.listerEnCours();
    }

    @GetMapping("/contrat/{idContrat}")
    public List<Impaye> parContrat(@PathVariable Long idContrat) {
        return impayeService.listerParContrat(idContrat);
    }

    @PatchMapping("/{id}/regler")
    public Impaye marquerRegle(@PathVariable Long id) {
        return impayeService.marquerRegle(id);
    }
}