package com.gestionloyer.service;

import com.gestionloyer.model.Locataire;
import com.gestionloyer.model.Lot;
import com.gestionloyer.model.Reclamation;
import com.gestionloyer.repository.LocataireRepository;
import com.gestionloyer.repository.LotRepository;
import com.gestionloyer.repository.ReclamationRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final LocataireRepository locataireRepository;
    private final LotRepository lotRepository;

    public ReclamationService(ReclamationRepository reclamationRepository,
                              LocataireRepository locataireRepository,
                              LotRepository lotRepository) {
        this.reclamationRepository = reclamationRepository;
        this.locataireRepository = locataireRepository;
        this.lotRepository = lotRepository;
    }

    public Reclamation creer(Long idLocataire, Long idLot, Reclamation reclamation) {
        Locataire locataire = locataireRepository.findById(idLocataire)
                .orElseThrow(() -> new RuntimeException("Locataire introuvable"));
        reclamation.setLocataire(locataire);

        if (idLot != null) {
            Lot lot = lotRepository.findById(idLot)
                    .orElseThrow(() -> new RuntimeException("Lot introuvable"));
            reclamation.setLot(lot);
        }

        reclamation.setStatut("OUVERTE");
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> lister() {
        return reclamationRepository.findAll();
    }

    public List<Reclamation> parLocataire(Long idLocataire) {
        return reclamationRepository.findByLocataireIdUtilisateur(idLocataire);
    }

    public Reclamation changerStatut(Long id, String statut) {
        Reclamation r = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
        r.setStatut(statut);
        if ("RESOLUE".equalsIgnoreCase(statut)) {
            r.setDateResolution(new Date());
        }
        return reclamationRepository.save(r);
    }
}