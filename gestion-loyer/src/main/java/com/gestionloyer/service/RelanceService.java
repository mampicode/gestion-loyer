package com.gestionloyer.service;

import com.gestionloyer.model.*;
import com.gestionloyer.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RelanceService {

    private final RelanceRepository relanceRepository;
    private final ImpayeRepository impayeRepository;
    private final NotificationService notificationService;

    public RelanceService(RelanceRepository relanceRepository,
                          ImpayeRepository impayeRepository,
                          NotificationService notificationService) {
        this.relanceRepository = relanceRepository;
        this.impayeRepository = impayeRepository;
        this.notificationService = notificationService;
    }

    public Relance creerRelance(Long idImpaye) {
        Impaye impaye = impayeRepository.findById(idImpaye)
                .orElseThrow(() -> new RuntimeException("Impayé introuvable"));

        int jours = impaye.getNombreJoursRetard() != null ? impaye.getNombreJoursRetard() : 0;

        int niveau;
        String canal;
        String message;

        if (jours >= 30) {
            niveau = 4;
            canal = "SMS";
            message = "Relance ferme : impayé de plus de 30 jours.";
        } else if (jours >= 15) {
            niveau = 3;
            canal = "SMS";
            message = "Relance SMS : votre loyer est en retard de 15 jours.";
        } else if (jours >= 7) {
            niveau = 2;
            canal = "EMAIL";
            message = "Relance email : votre loyer est en retard de 7 jours.";
        } else {
            niveau = 1;
            canal = "APP";
            message = "Rappel : un loyer est en retard.";
        }

        Utilisateur user = impaye.getContrat().getLocataire().getUtilisateur();

        Relance relance = new Relance();
        relance.setNiveau(niveau);
        relance.setCanal(canal);
        relance.setMessage(message);
        relance.setJoursRetard(jours);
        relance.setImpaye(impaye);
        relance.setContrat(impaye.getContrat());
        relance.setUtilisateur(user);
        relance.setStatut("ENVOYEE");

        Relance saved = relanceRepository.save(relance);

        // crée aussi une notification app
        notificationService.envoyer(
                user.getIdUtilisateur(),
                "Relance de paiement",
                message,
                canal
        );

        return saved;
    }

    public List<Relance> listerParContrat(Long idContrat) {
        return relanceRepository.findByContratIdContrat(idContrat);
    }

    public List<Relance> listerParUtilisateur(Long idUtilisateur) {
        return relanceRepository.findByUtilisateurIdUtilisateur(idUtilisateur);
    }
}