package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "historique_connexion")
public class HistoriqueConnexion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historique")
    private Long idHistorique;

    @Column(name = "date_connexion")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateConnexion = new Date();

    @Column(name = "adresse_ip", length = 50)
    private String adresseIp;

    @Column(name = "appareil", length = 100)
    private String appareil;

    @Column(name = "navigateur", length = 100)
    private String navigateur;

    @Column(name = "succes", length = 1)
    private String succes = "O";

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;

    public HistoriqueConnexion() {
    }

    public Long getIdHistorique() {
        return idHistorique;
    }

    public void setIdHistorique(Long idHistorique) {
        this.idHistorique = idHistorique;
    }

    public Date getDateConnexion() {
        return dateConnexion;
    }

    public void setDateConnexion(Date dateConnexion) {
        this.dateConnexion = dateConnexion;
    }

    public String getAdresseIp() {
        return adresseIp;
    }

    public void setAdresseIp(String adresseIp) {
        this.adresseIp = adresseIp;
    }

    public String getAppareil() {
        return appareil;
    }

    public void setAppareil(String appareil) {
        this.appareil = appareil;
    }

    public String getNavigateur() {
        return navigateur;
    }

    public void setNavigateur(String navigateur) {
        this.navigateur = navigateur;
    }

    public String getSucces() {
        return succes;
    }

    public void setSucces(String succes) {
        this.succes = succes;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}