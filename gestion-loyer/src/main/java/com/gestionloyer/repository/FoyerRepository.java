package com.gestionloyer.repository;

import com.gestionloyer.model.Foyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoyerRepository extends JpaRepository<Foyer, Long> {

    @Query("SELECT f FROM Foyer f WHERE " +
            "LOWER(f.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.adresse) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.ville) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.quartier) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Foyer> search(String keyword);
}