package com.gestionloyer.repository;

import com.gestionloyer.model.HistoriqueConnexion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoriqueConnexionRepository extends JpaRepository<HistoriqueConnexion, Long> {
    List<HistoriqueConnexion> findByUtilisateurIdUtilisateur(Long idUtilisateur);
}