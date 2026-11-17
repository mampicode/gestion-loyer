package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "contrat_location")
public class ContratLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contrat")
    private Long idContrat;

    @Column(name = "date_debut", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateDebut;

    @Column(name = "date_fin")
    @Temporal(TemporalType.DATE)
    private Date dateFin;

    @Column(name = "montant_loyer", nullable = false)
    private Double montantLoyer;

    @Column(name = "caution")
    private Double caution;

    @Column(name = "duree")
    private Integer duree;

    @Column(name = "statut", length = 30)
    private String statut = "EN_COURS";

    @Column(name = "date_signature")
    @Temporal(TemporalType.DATE)
    private Date dateSignature;

    @Column(name = "renouvellement_automatique", length = 1)
    private String renouvellementAutomatique = "N";

    @ManyToOne
    @JoinColumn(name = "id_locataire", nullable = false)
    private Locataire locataire;

    @ManyToOne
    @JoinColumn(name = "id_lot", nullable = false)
    private Lot lot;

    public ContratLocation() {}

    public Long getIdContrat() { return idContrat; }
    public void setIdContrat(Long idContrat) { this.idContrat = idContrat; }

    public Date getDateDebut() { return dateDebut; }
    public void setDateDebut(Date dateDebut) { this.dateDebut = dateDebut; }

    public Date getDateFin() { return dateFin; }
    public void setDateFin(Date dateFin) { this.dateFin = dateFin; }

    public Double getMontantLoyer() { return montantLoyer; }
    public void setMontantLoyer(Double montantLoyer) { this.montantLoyer = montantLoyer; }

    public Double getCaution() { return caution; }
    public void setCaution(Double caution) { this.caution = caution; }

    public Integer getDuree() { return duree; }
    public void setDuree(Integer duree) { this.duree = duree; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Date getDateSignature() { return dateSignature; }
    public void setDateSignature(Date dateSignature) { this.dateSignature = dateSignature; }

    public String getRenouvellementAutomatique() { return renouvellementAutomatique; }
    public void setRenouvellementAutomatique(String renouvellementAutomatique) {
        this.renouvellementAutomatique = renouvellementAutomatique;
    }

    public Locataire getLocataire() { return locataire; }
    public void setLocataire(Locataire locataire) { this.locataire = locataire; }

    public Lot getLot() { return lot; }
    public void setLot(Lot lot) { this.lot = lot; }
}