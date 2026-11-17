package com.gestionloyer.controller;

import com.gestionloyer.model.Foyer;
import com.gestionloyer.service.FoyerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foyers")
@CrossOrigin(origins = "*")
public class FoyerController {

    private final FoyerService foyerService;

    public FoyerController(FoyerService foyerService) {
        this.foyerService = foyerService;
    }

    @PostMapping
    public Foyer creer(@RequestBody Foyer foyer) {
        return foyerService.creer(foyer);
    }

    @GetMapping
    public List<Foyer> lister() {
        return foyerService.lister();
    }

    @GetMapping("/{id}")
    public Foyer getById(@PathVariable Long id) {
        return foyerService.trouverParId(id);
    }

    @PutMapping("/{id}")
    public Foyer modifier(@PathVariable Long id, @RequestBody Foyer foyer) {
        return foyerService.modifier(id, foyer);
    }

    @DeleteMapping("/{id}")
    public void desactiver(@PathVariable Long id) {
        foyerService.desactiver(id);
    }
    @GetMapping("/search")
    public List<Foyer> rechercher(@RequestParam(required = false) String q) {
        return foyerService.rechercher(q);
    }
}