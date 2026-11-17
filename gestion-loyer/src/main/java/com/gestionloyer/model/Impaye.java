package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "impaye")
public class Impaye {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_impaye")
    private Long idImpaye;

    @Column(name = "montant_du", nullable = false)
    private Double montantDu;

    @Column(name = "montant_restant")
    private Double montantRestant;

    @Column(name = "date_echeance")
    @Temporal(TemporalType.DATE)
    private Date dateEcheance;

    @Column(name = "nombre_jours_retard")
    private Integer nombreJoursRetard;

    @Column(name = "penalite")
    private Double penalite = 0.0;

    @Column(name = "statut", length = 30)
    private String statut = "EN_COURS";

    @Column(name = "date_creation")
    @Temporal(TemporalType.DATE)
    private Date dateCreation = new Date();

    @Column(name = "date_reglement")
    @Temporal(TemporalType.DATE)
    private Date dateReglement;

    @ManyToOne
    @JoinColumn(name = "id_contrat", nullable = false)
    private ContratLocation contrat;

    public Impaye() {}

    public Long getIdImpaye() { return idImpaye; }
    public void setIdImpaye(Long idImpaye) { this.idImpaye = idImpaye; }

    public Double getMontantDu() { return montantDu; }
    public void setMontantDu(Double montantDu) { this.montantDu = montantDu; }

    public Double getMontantRestant() { return montantRestant; }
    public void setMontantRestant(Double montantRestant) { this.montantRestant = montantRestant; }

    public Date getDateEcheance() { return dateEcheance; }
    public void setDateEcheance(Date dateEcheance) { this.dateEcheance = dateEcheance; }

    public Integer getNombreJoursRetard() { return nombreJoursRetard; }
    public void setNombreJoursRetard(Integer nombreJoursRetard) {
        this.nombreJoursRetard = nombreJoursRetard;
    }

    public Double getPenalite() { return penalite; }
    public void setPenalite(Double penalite) { this.penalite = penalite; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Date getDateCreation() { return dateCreation; }
    public void setDateCreation(Date dateCreation) { this.dateCreation = dateCreation; }

    public Date getDateReglement() { return dateReglement; }
    public void setDateReglement(Date dateReglement) { this.dateReglement = dateReglement; }

    public ContratLocation getContrat() { return contrat; }
    public void setContrat(ContratLocation contrat) { this.contrat = contrat; }
}