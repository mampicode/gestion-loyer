package com.gestionloyer.service;

import com.gestionloyer.model.ContratLocation;
import com.gestionloyer.model.Paiement;
import com.gestionloyer.repository.ContratLocationRepository;
import com.gestionloyer.repository.PaiementRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final ContratLocationRepository contratRepository;

    public PaiementService(PaiementRepository paiementRepository,
                           ContratLocationRepository contratRepository) {
        this.paiementRepository = paiementRepository;
        this.contratRepository = contratRepository;
    }

    public Paiement enregistrer(Long idContrat, Paiement paiement) {
        ContratLocation contrat = contratRepository.findById(idContrat)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));

        paiement.setContrat(contrat);
        paiement.setStatut("VALIDE");
        paiement.setDateCreation(new Date());

        // Génération simple de quittance
        paiement.setNumeroQuittance("Q-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        paiement.setDateEmissionQuittance(new Date());

        return paiementRepository.save(paiement);
    }

    public List<Paiement> lister() {
        return paiementRepository.findAll();
    }

    public List<Paiement> listerParContrat(Long idContrat) {
        return paiementRepository.findByContratIdContrat(idContrat);
    }

    public Paiement trouverParId(Long id) {
        return paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable"));
    }

    public Double calculerSolde(Long idContrat) {
        ContratLocation contrat = contratRepository.findById(idContrat)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));

        List<Paiement> paiements = paiementRepository.findByContratIdContrat(idContrat);

        double totalPaye = paiements.stream()
                .filter(p -> "VALIDE".equalsIgnoreCase(p.getStatut()))
                .mapToDouble(Paiement::getMontant)
                .sum();

        // Solde simplifié : loyer mensuel - total payé (à affiner selon périodes)
        return contrat.getMontantLoyer() - totalPaye;
    }

    public Paiement annuler(Long id) {
        Paiement paiement = trouverParId(id);
        paiement.setStatut("ANNULE");
        return paiementRepository.save(paiement);
    }
}