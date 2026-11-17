package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notification")
    private Long idNotification;

    @Column(name = "titre", length = 150)
    private String titre;

    @Column(name = "message", length = 1000)
    private String message;

    @Column(name = "type_notif", length = 30)
    private String typeNotif; // EMAIL, SMS, PUSH, APP

    @Column(name = "date_envoi")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateEnvoi = new Date();

    @Column(name = "lu", length = 1)
    private String lu = "N";

    @Column(name = "statut", length = 30)
    private String statut = "ENVOYEE";

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;

    public Notification() {}

    public Long getIdNotification() { return idNotification; }
    public void setIdNotification(Long idNotification) { this.idNotification = idNotification; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTypeNotif() { return typeNotif; }
    public void setTypeNotif(String typeNotif) { this.typeNotif = typeNotif; }

    public Date getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(Date dateEnvoi) { this.dateEnvoi = dateEnvoi; }

    public String getLu() { return lu; }
    public void setLu(String lu) { this.lu = lu; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }
}