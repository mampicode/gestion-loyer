package com.gestionloyer.repository;

import com.gestionloyer.model.Lot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LotRepository extends JpaRepository<Lot, Long> {
    List<Lot> findByFoyerIdFoyer(Long idFoyer);
    List<Lot> findByStatut(String statut);
}