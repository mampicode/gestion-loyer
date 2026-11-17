package com.gestionloyer.service;

import com.gestionloyer.model.ContratLocation;
import com.gestionloyer.model.Locataire;
import com.gestionloyer.model.Lot;
import com.gestionloyer.repository.ContratLocationRepository;
import com.gestionloyer.repository.LocataireRepository;
import com.gestionloyer.repository.LotRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ContratService {

    private final ContratLocationRepository contratRepository;
    private final LocataireRepository locataireRepository;
    private final LotRepository lotRepository;

    public ContratService(ContratLocationRepository contratRepository,
                          LocataireRepository locataireRepository,
                          LotRepository lotRepository) {
        this.contratRepository = contratRepository;
        this.locataireRepository = locataireRepository;
        this.lotRepository = lotRepository;
    }

    public ContratLocation creer(Long idLocataire, Long idLot, ContratLocation contrat) {
        Locataire locataire = locataireRepository.findById(idLocataire)
                .orElseThrow(() -> new RuntimeException("Locataire introuvable"));
        Lot lot = lotRepository.findById(idLot)
                .orElseThrow(() -> new RuntimeException("Lot introuvable"));

        if (!"LIBRE".equalsIgnoreCase(lot.getStatut())) {
            throw new RuntimeException("Ce lot n'est pas disponible");
        }

        contrat.setLocataire(locataire);
        contrat.setLot(lot);
        contrat.setStatut("EN_COURS");
        if (contrat.getDateSignature() == null) {
            contrat.setDateSignature(new Date());
        }

        ContratLocation saved = contratRepository.save(contrat);

        lot.setStatut("OCCUPE");
        lotRepository.save(lot);

        return saved;
    }

    public List<ContratLocation> lister() {
        return contratRepository.findAll();
    }

    public Optional<ContratLocation> trouverParId(Long id) {
        return contratRepository.findById(id);
    }

    public List<ContratLocation> listerParLocataire(Long idLocataire) {
        return contratRepository.findByLocataireIdUtilisateur(idLocataire);
    }

    public ContratLocation resilier(Long id) {
        ContratLocation contrat = contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));

        contrat.setStatut("RESILIE");
        contratRepository.save(contrat);

        Lot lot = contrat.getLot();
        lot.setStatut("LIBRE");
        lotRepository.save(lot);

        return contrat;
    }

    public ContratLocation renouveler(Long id, Date nouvelleDateFin) {
        ContratLocation contrat = contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));

        contrat.setDateFin(nouvelleDateFin);
        contrat.setStatut("EN_COURS");
        return contratRepository.save(contrat);
    }

    public ContratLocation modifier(Long id, ContratLocation details) {
        ContratLocation contrat = contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));

        contrat.setDateDebut(details.getDateDebut());
        contrat.setDateFin(details.getDateFin());
        contrat.setMontantLoyer(details.getMontantLoyer());
        contrat.setCaution(details.getCaution());
        contrat.setDuree(details.getDuree());
        contrat.setRenouvellementAutomatique(details.getRenouvellementAutomatique());

        return contratRepository.save(contrat);
    }
}