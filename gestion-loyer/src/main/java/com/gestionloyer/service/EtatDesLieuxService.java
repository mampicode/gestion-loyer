package com.gestionloyer.service;

import com.gestionloyer.model.ContratLocation;
import com.gestionloyer.model.EtatDesLieux;
import com.gestionloyer.repository.ContratLocationRepository;
import com.gestionloyer.repository.EtatDesLieuxRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EtatDesLieuxService {

    private final EtatDesLieuxRepository etatRepository;
    private final ContratLocationRepository contratRepository;

    public EtatDesLieuxService(EtatDesLieuxRepository etatRepository,
                               ContratLocationRepository contratRepository) {
        this.etatRepository = etatRepository;
        this.contratRepository = contratRepository;
    }

    public EtatDesLieux creer(Long idContrat, EtatDesLieux etat) {
        ContratLocation contrat = contratRepository.findById(idContrat)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));
        etat.setContrat(contrat);
        return etatRepository.save(etat);
    }

    public List<EtatDesLieux> listerParContrat(Long idContrat) {
        return etatRepository.findByContratIdContrat(idContrat);
    }

    public EtatDesLieux modifier(Long id, EtatDesLieux details) {
        EtatDesLieux etat = etatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("État des lieux introuvable"));

        etat.setTypeEtat(details.getTypeEtat());
        etat.setDateEtat(details.getDateEtat());
        etat.setObservations(details.getObservations());
        etat.setEtatGeneral(details.getEtatGeneral());

        return etatRepository.save(etat);
    }
}