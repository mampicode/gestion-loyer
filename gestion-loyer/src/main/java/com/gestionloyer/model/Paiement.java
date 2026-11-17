package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paiement")
    private Long idPaiement;

    @Column(name = "montant", nullable = false)
    private Double montant;

    @Column(name = "date_paiement")
    @Temporal(TemporalType.DATE)
    private Date datePaiement = new Date();

    @Column(name = "mode_paiement", length = 50)
    private String modePaiement;

    @Column(name = "periode", length = 50)
    private String periode;

    @Column(name = "statut", length = 30)
    private String statut = "VALIDE";

    @Column(name = "reference", length = 100)
    private String reference;

    @Column(name = "date_creation")
    @Temporal(TemporalType.DATE)
    private Date dateCreation = new Date();

    @Column(name = "numero_quittance", length = 50)
    private String numeroQuittance;

    @Column(name = "date_emission_quittance")
    @Temporal(TemporalType.DATE)
    private Date dateEmissionQuittance;

    @Column(name = "fichier_pdf", length = 255)
    private String fichierPdf;

    @ManyToOne
    @JoinColumn(name = "id_contrat", nullable = false)
    private ContratLocation contrat;

    public Paiement() {}

    public Long getIdPaiement() { return idPaiement; }
    public void setIdPaiement(Long idPaiement) { this.idPaiement = idPaiement; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public Date getDatePaiement() { return datePaiement; }
    public void setDatePaiement(Date datePaiement) { this.datePaiement = datePaiement; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public Date getDateCreation() { return dateCreation; }
    public void setDateCreation(Date dateCreation) { this.dateCreation = dateCreation; }

    public String getNumeroQuittance() { return numeroQuittance; }
    public void setNumeroQuittance(String numeroQuittance) { this.numeroQuittance = numeroQuittance; }

    public Date getDateEmissionQuittance() { return dateEmissionQuittance; }
    public void setDateEmissionQuittance(Date dateEmissionQuittance) {
        this.dateEmissionQuittance = dateEmissionQuittance;
    }

    public String getFichierPdf() { return fichierPdf; }
    public void setFichierPdf(String fichierPdf) { this.fichierPdf = fichierPdf; }

    public ContratLocation getContrat() { return contrat; }
    public void setContrat(ContratLocation contrat) { this.contrat = contrat; }
}