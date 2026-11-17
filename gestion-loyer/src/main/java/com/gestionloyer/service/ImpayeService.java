package com.gestionloyer.service;

import com.gestionloyer.model.ContratLocation;
import com.gestionloyer.model.Impaye;
import com.gestionloyer.repository.ContratLocationRepository;
import com.gestionloyer.repository.ImpayeRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class ImpayeService {

    private final ImpayeRepository impayeRepository;
    private final ContratLocationRepository contratRepository;

    public ImpayeService(ImpayeRepository impayeRepository,
                         ContratLocationRepository contratRepository) {
        this.impayeRepository = impayeRepository;
        this.contratRepository = contratRepository;
    }

    public Impaye creer(Long idContrat, Impaye impaye) {
        ContratLocation contrat = contratRepository.findById(idContrat)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));

        impaye.setContrat(contrat);
        impaye.setStatut("EN_COURS");
        impaye.setDateCreation(new Date());

        if (impaye.getMontantRestant() == null) {
            impaye.setMontantRestant(impaye.getMontantDu());
        }

        if (impaye.getDateEcheance() != null) {
            long diff = new Date().getTime() - impaye.getDateEcheance().getTime();
            long jours = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
            impaye.setNombreJoursRetard((int) Math.max(jours, 0));
            // pénalité simple : 1% par jour de retard (exemple)
            impaye.setPenalite(impaye.getMontantDu() * 0.01 * impaye.getNombreJoursRetard());
        }

        return impayeRepository.save(impaye);
    }

    public List<Impaye> lister() {
        return impayeRepository.findAll();
    }

    public List<Impaye> listerEnCours() {
        return impayeRepository.findByStatut("EN_COURS");
    }

    public List<Impaye> listerParContrat(Long idContrat) {
        return impayeRepository.findByContratIdContrat(idContrat);
    }

    public Impaye marquerRegle(Long id) {
        Impaye impaye = impayeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Impayé introuvable"));

        impaye.setStatut("REGLE");
        impaye.setMontantRestant(0.0);
        impaye.setDateReglement(new Date());
        return impayeRepository.save(impaye);
    }
}