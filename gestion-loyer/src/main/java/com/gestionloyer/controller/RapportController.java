package com.gestionloyer.controller;

import com.gestionloyer.model.Rapport;
import com.gestionloyer.service.RapportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rapports")
@CrossOrigin(origins = "*")
public class RapportController {

    private final RapportService rapportService;

    public RapportController(RapportService rapportService) {
        this.rapportService = rapportService;
    }

    @GetMapping("/ca")
    public Map<String, Object> ca() {
        return rapportService.chiffreAffaires();
    }

    @GetMapping("/impayes")
    public Map<String, Object> impayes() {
        return rapportService.situationImpayes();
    }

    @GetMapping
    public List<Rapport> lister() {
        return rapportService.lister();
    }

    @PostMapping
    public Rapport sauvegarder(@RequestBody Rapport rapport) {
        return rapportService.sauvegarderMeta(rapport);
    }
}