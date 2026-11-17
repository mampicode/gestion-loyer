package com.gestionloyer.repository;

import com.gestionloyer.model.Impaye;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImpayeRepository extends JpaRepository<Impaye, Long> {
    List<Impaye> findByContratIdContrat(Long idContrat);
    List<Impaye> findByStatut(String statut);
}