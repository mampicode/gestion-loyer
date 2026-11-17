package com.gestionloyer.service;

import com.gestionloyer.model.Foyer;
import com.gestionloyer.model.Lot;
import com.gestionloyer.repository.FoyerRepository;
import com.gestionloyer.repository.LotRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LotService {

    private final LotRepository lotRepository;
    private final FoyerRepository foyerRepository;

    public LotService(LotRepository lotRepository, FoyerRepository foyerRepository) {
        this.lotRepository = lotRepository;
        this.foyerRepository = foyerRepository;
    }

    public Lot ajouter(Lot lot, Long idFoyer) {
        Foyer foyer = foyerRepository.findById(idFoyer)
                .orElseThrow(() -> new RuntimeException("Foyer introuvable"));
        lot.setFoyer(foyer);
        return lotRepository.save(lot);
    }

    public List<Lot> lister() {
        return lotRepository.findAll();
    }

    public List<Lot> listerParFoyer(Long idFoyer) {
        return lotRepository.findByFoyerIdFoyer(idFoyer);
    }

    public List<Lot> listerLibres() {
        return lotRepository.findByStatut("LIBRE");
    }

    public Optional<Lot> trouverParId(Long id) {
        return lotRepository.findById(id);
    }

    public Lot modifier(Long id, Lot details) {
        Lot lot = lotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lot introuvable"));

        lot.setNumero(details.getNumero());
        lot.setTypeLot(details.getTypeLot());
        lot.setSurface(details.getSurface());
        lot.setNombrePieces(details.getNombrePieces());
        lot.setEtage(details.getEtage());
        lot.setLoyerBase(details.getLoyerBase());
        lot.setCaution(details.getCaution());
        lot.setStatut(details.getStatut());
        lot.setDescription(details.getDescription());

        return lotRepository.save(lot);
    }

    public Lot changerStatut(Long id, String statut) {
        Lot lot = lotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lot introuvable"));
        lot.setStatut(statut);
        return lotRepository.save(lot);
    }

    public void supprimer(Long id) {
        Lot lot = lotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lot introuvable"));
        lot.setStatut("INACTIF");
        lotRepository.save(lot);
    }
}