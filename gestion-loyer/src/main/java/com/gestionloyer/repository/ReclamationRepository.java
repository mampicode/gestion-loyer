package com.gestionloyer.repository;

import com.gestionloyer.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByLocataireIdUtilisateur(Long idLocataire);
    List<Reclamation> findByStatut(String statut);
}