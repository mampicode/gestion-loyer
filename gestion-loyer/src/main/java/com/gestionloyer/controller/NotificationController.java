package com.gestionloyer.controller;

import com.gestionloyer.model.Notification;
import com.gestionloyer.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/utilisateur/{idUtilisateur}")
    public Notification envoyer(@PathVariable Long idUtilisateur,
                                @RequestBody Map<String, String> body) {
        return notificationService.envoyer(
                idUtilisateur,
                body.get("titre"),
                body.get("message"),
                body.getOrDefault("typeNotif", "APP")
        );
    }

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<Notification> parUtilisateur(@PathVariable Long idUtilisateur) {
        return notificationService.listerParUtilisateur(idUtilisateur);
    }

    @PatchMapping("/{id}/lu")
    public Notification marquerLu(@PathVariable Long id) {
        return notificationService.marquerLu(id);
    }
}