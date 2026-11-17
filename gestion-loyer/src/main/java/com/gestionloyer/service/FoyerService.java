package com.gestionloyer.service;

import com.gestionloyer.model.Foyer;
import com.gestionloyer.repository.FoyerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoyerService {

    private final FoyerRepository foyerRepository;

    public FoyerService(FoyerRepository foyerRepository) {
        this.foyerRepository = foyerRepository;
    }

    public Foyer creer(Foyer foyer) {
        foyer.setStatut("ACTIF");
        return foyerRepository.save(foyer);
    }

    public List<Foyer> lister() {
        return foyerRepository.findAll();
    }

    public List<Foyer> rechercher(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return foyerRepository.findAll();
        }
        return foyerRepository.search(keyword);
    }

    public Foyer trouverParId(Long id) {
        return foyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Foyer introuvable"));
    }

    public Foyer modifier(Long id, Foyer foyer) {
        Foyer existing = trouverParId(id);
        existing.setNom(foyer.getNom());
        existing.setTypeFoyer(foyer.getTypeFoyer());
        existing.setAdresse(foyer.getAdresse());
        existing.setVille(foyer.getVille());
        existing.setQuartier(foyer.getQuartier());
        existing.setDescription(foyer.getDescription());
        existing.setLatitude(foyer.getLatitude());
        existing.setLongitude(foyer.getLongitude());
        existing.setStatut(foyer.getStatut());
        return foyerRepository.save(existing);
    }
    public void supprimer(Long id) {
        foyerRepository.deleteById(id);
    }

    public void desactiver(Long id) {
        Foyer foyer = trouverParId(id);
        foyer.setStatut("INACTIF");
        foyerRepository.save(foyer);
    }
}