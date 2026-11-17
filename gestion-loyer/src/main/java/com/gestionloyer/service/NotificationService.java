package com.gestionloyer.service;

import com.gestionloyer.model.Notification;
import com.gestionloyer.model.Utilisateur;
import com.gestionloyer.repository.NotificationRepository;
import com.gestionloyer.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UtilisateurRepository utilisateurRepository) {
        this.notificationRepository = notificationRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public Notification envoyer(Long idUtilisateur, String titre, String message, String typeNotif) {
        Utilisateur user = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Notification notif = new Notification();
        notif.setTitre(titre);
        notif.setMessage(message);
        notif.setTypeNotif(typeNotif);
        notif.setUtilisateur(user);
        notif.setLu("N");
        notif.setStatut("ENVOYEE");

        return notificationRepository.save(notif);
    }

    public List<Notification> listerParUtilisateur(Long idUtilisateur) {
        return notificationRepository.findByUtilisateurIdUtilisateur(idUtilisateur);
    }

    public Notification marquerLu(Long id) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));
        notif.setLu("O");
        return notificationRepository.save(notif);
    }
}