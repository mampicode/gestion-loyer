package com.gestionloyer.controller;

import com.gestionloyer.model.Document;
import com.gestionloyer.service.DocumentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/utilisateur/{idUtilisateur}")
    public Document upload(@PathVariable Long idUtilisateur,
                           @RequestParam String typeDocument,
                           @RequestParam("file") MultipartFile file) throws Exception {
        return documentService.uploadPourUtilisateur(idUtilisateur, typeDocument, file);
    }

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Document> parUtilisateur(@PathVariable Long idUtilisateur) {
        return documentService.listerParUtilisateur(idUtilisateur);
    }

    @GetMapping("/type/{type}")
    public List<Document> parType(@PathVariable String type) {
        return documentService.listerParType(type);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        documentService.supprimer(id);
    }
}