package com.gestionloyer.service;

import com.gestionloyer.model.Impaye;
import com.gestionloyer.model.Paiement;
import com.gestionloyer.model.Rapport;
import com.gestionloyer.repository.ImpayeRepository;
import com.gestionloyer.repository.PaiementRepository;
import com.gestionloyer.repository.RapportRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RapportService {

    private final RapportRepository rapportRepository;
    private final PaiementRepository paiementRepository;
    private final ImpayeRepository impayeRepository;

    public RapportService(RapportRepository rapportRepository,
                          PaiementRepository paiementRepository,
                          ImpayeRepository impayeRepository) {
        this.rapportRepository = rapportRepository;
        this.paiementRepository = paiementRepository;
        this.impayeRepository = impayeRepository;
    }

    public Map<String, Object> chiffreAffaires() {
        List<Paiement> paiements = paiementRepository.findAll();
        double total = paiements.stream()
                .filter(p -> "VALIDE".equalsIgnoreCase(p.getStatut()))
                .mapToDouble(Paiement::getMontant)
                .sum();

        Map<String, Object> result = new HashMap<>();
        result.put("type", "CA");
        result.put("totalEncaissements", total);
        result.put("nombrePaiements", paiements.size());
        return result;
    }

    public Map<String, Object> situationImpayes() {
        List<Impaye> impayes = impayeRepository.findByStatut("EN_COURS");
        double total = impayes.stream()
                .mapToDouble(i -> i.getMontantRestant() != null ? i.getMontantRestant() : 0)
                .sum();

        Map<String, Object> result = new HashMap<>();
        result.put("type", "IMPAYES");
        result.put("nombreImpayes", impayes.size());
        result.put("montantTotal", total);
        return result;
    }

    public Rapport sauvegarderMeta(Rapport rapport) {
        return rapportRepository.save(rapport);
    }

    public List<Rapport> lister() {
        return rapportRepository.findAll();
    }
}