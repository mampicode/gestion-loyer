package com.gestionloyer.repository;

import com.gestionloyer.model.Relance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RelanceRepository extends JpaRepository<Relance, Long> {
    List<Relance> findByContratIdContrat(Long idContrat);
    List<Relance> findByUtilisateurIdUtilisateur(Long idUtilisateur);
}