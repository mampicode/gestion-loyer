package com.gestionloyer.repository;

import com.gestionloyer.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUtilisateurIdUtilisateur(Long idUtilisateur);
    List<Document> findByTypeDocument(String typeDocument);
}