package com.gestionloyer.service;

import com.gestionloyer.model.HistoriqueConnexion;
import com.gestionloyer.model.Locataire;
import com.gestionloyer.model.Utilisateur;
import com.gestionloyer.repository.HistoriqueConnexionRepository;
import com.gestionloyer.repository.LocataireRepository;
import com.gestionloyer.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final HistoriqueConnexionRepository historiqueConnexionRepository;
    private final LocataireRepository locataireRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              HistoriqueConnexionRepository historiqueConnexionRepository,
                              LocataireRepository locataireRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.historiqueConnexionRepository = historiqueConnexionRepository;
        this.locataireRepository = locataireRepository;
    }

    public List<Utilisateur> listerTous() {
        return utilisateurRepository.findAll();
    }

    public List<Locataire> listerLocataires() {
        return locataireRepository.findAll();
    }

    public Optional<Utilisateur> trouverParId(Long id) {
        return utilisateurRepository.findById(id);
    }

    public List<HistoriqueConnexion> historiqueParUtilisateur(Long idUtilisateur) {
        return historiqueConnexionRepository.findByUtilisateurIdUtilisateur(idUtilisateur);
    }

    public List<HistoriqueConnexion> historiqueTous() {
        return historiqueConnexionRepository.findAll();
    }
}