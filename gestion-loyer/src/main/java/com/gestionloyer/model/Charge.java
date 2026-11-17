package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "charge")
public class Charge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_charge")
    private Long idCharge;

    @Column(name = "libelle", nullable = false, length = 150)
    private String libelle;

    @Column(name = "type_charge", length = 50)
    private String typeCharge;

    @Column(name = "montant", nullable = false)
    private Double montant;

    @Column(name = "periode", length = 50)
    private String periode;

    @Column(name = "recuperable", length = 1)
    private String recuperable = "O";

    @Column(name = "date_creation")
    @Temporal(TemporalType.DATE)
    private Date dateCreation = new Date();

    @ManyToOne
    @JoinColumn(name = "id_foyer")
    private Foyer foyer;

    @ManyToOne
    @JoinColumn(name = "id_lot")
    private Lot lot;

    public Charge() {}

    public Long getIdCharge() { return idCharge; }
    public void setIdCharge(Long idCharge) { this.idCharge = idCharge; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getTypeCharge() { return typeCharge; }
    public void setTypeCharge(String typeCharge) { this.typeCharge = typeCharge; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public String getRecuperable() { return recuperable; }
    public void setRecuperable(String recuperable) { this.recuperable = recuperable; }

    public Date getDateCreation() { return dateCreation; }
    public void setDateCreation(Date dateCreation) { this.dateCreation = dateCreation; }

    public Foyer getFoyer() { return foyer; }
    public void setFoyer(Foyer foyer) { this.foyer = foyer; }

    public Lot getLot() { return lot; }
    public void setLot(Lot lot) { this.lot = lot; }
}