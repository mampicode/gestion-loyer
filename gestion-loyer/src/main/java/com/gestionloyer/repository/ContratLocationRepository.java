package com.gestionloyer.repository;

import com.gestionloyer.model.ContratLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContratLocationRepository extends JpaRepository<ContratLocation, Long> {
    List<ContratLocation> findByLocataireIdUtilisateur(Long idLocataire);
    List<ContratLocation> findByLotIdLot(Long idLot);
    List<ContratLocation> findByStatut(String statut);
}