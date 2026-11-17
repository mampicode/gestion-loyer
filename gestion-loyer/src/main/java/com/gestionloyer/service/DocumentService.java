package com.gestionloyer.service;

import com.gestionloyer.model.Document;
import com.gestionloyer.model.Utilisateur;
import com.gestionloyer.repository.DocumentRepository;
import com.gestionloyer.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final String uploadDir = "uploads/";

    public DocumentService(DocumentRepository documentRepository,
                           UtilisateurRepository utilisateurRepository) {
        this.documentRepository = documentRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public Document uploadPourUtilisateur(Long idUtilisateur,
                                          String typeDocument,
                                          MultipartFile file) throws IOException {
        Utilisateur user = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Files.createDirectories(Paths.get(uploadDir));

        String originalName = file.getOriginalFilename();
        String extension = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.') + 1)
                : "bin";

        String storedName = UUID.randomUUID() + "_" + originalName;
        Path path = Paths.get(uploadDir + storedName);
        Files.write(path, file.getBytes());

        Document doc = new Document();
        doc.setNom(originalName);
        doc.setTypeDocument(typeDocument);
        doc.setCheminFichier(path.toString());
        doc.setTaille(file.getSize());
        doc.setFormat(extension.toUpperCase());
        doc.setUtilisateur(user);

        return documentRepository.save(doc);
    }

    public List<Document> listerParUtilisateur(Long idUtilisateur) {
        return documentRepository.findByUtilisateurIdUtilisateur(idUtilisateur);
    }

    public List<Document> listerParType(String type) {
        return documentRepository.findByTypeDocument(type);
    }

    public void supprimer(Long id) {
        documentRepository.deleteById(id);
    }
}