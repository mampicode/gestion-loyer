package com.gestionloyer.repository;

import com.gestionloyer.model.EtatDesLieux;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtatDesLieuxRepository extends JpaRepository<EtatDesLieux, Long> {
    List<EtatDesLieux> findByContratIdContrat(Long idContrat);
}