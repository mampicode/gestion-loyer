package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "relance")
public class Relance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_relance")
    private Long idRelance;

    @Column(name = "niveau", nullable = false)
    private Integer niveau;

    @Column(name = "canal", nullable = false, length = 20)
    private String canal;

    @Column(name = "message", length = 1000)
    private String message;

    @Column(name = "date_envoi")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateEnvoi = new Date();

    @Column(name = "statut", length = 30)
    private String statut = "ENVOYEE";

    @Column(name = "jours_retard")
    private Integer joursRetard;

    @ManyToOne
    @JoinColumn(name = "id_impaye")
    private Impaye impaye;

    @ManyToOne
    @JoinColumn(name = "id_contrat", nullable = false)
    private ContratLocation contrat;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;

    public Relance() {}

    // getters / setters
    public Long getIdRelance() { return idRelance; }
    public void setIdRelance(Long idRelance) { this.idRelance = idRelance; }

    public Integer getNiveau() { return niveau; }
    public void setNiveau(Integer niveau) { this.niveau = niveau; }

    public String getCanal() { return canal; }
    public void setCanal(String canal) { this.canal = canal; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Date getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(Date dateEnvoi) { this.dateEnvoi = dateEnvoi; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Integer getJoursRetard() { return joursRetard; }
    public void setJoursRetard(Integer joursRetard) { this.joursRetard = joursRetard; }

    public Impaye getImpaye() { return impaye; }
    public void setImpaye(Impaye impaye) { this.impaye = impaye; }

    public ContratLocation getContrat() { return contrat; }
    public void setContrat(ContratLocation contrat) { this.contrat = contrat; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }
}