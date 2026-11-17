package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "lot")
public class Lot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lot")
    private Long idLot;

    @Column(name = "numero", nullable = false, length = 50)
    private String numero;

    @Column(name = "type_lot", length = 50)
    private String typeLot;

    @Column(name = "surface")
    private Double surface;

    @Column(name = "nombre_pieces")
    private Integer nombrePieces;

    @Column(name = "etage")
    private Integer etage;

    @Column(name = "loyer_base", nullable = false)
    private Double loyerBase;

    @Column(name = "caution")
    private Double caution;

    @Column(name = "statut", length = 30)
    private String statut = "LIBRE";

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "date_ajout")
    @Temporal(TemporalType.DATE)
    private Date dateAjout = new Date();

    @ManyToOne
    @JoinColumn(name = "id_foyer", nullable = false)
    private Foyer foyer;

    public Lot() {}

    public Long getIdLot() { return idLot; }
    public void setIdLot(Long idLot) { this.idLot = idLot; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getTypeLot() { return typeLot; }
    public void setTypeLot(String typeLot) { this.typeLot = typeLot; }

    public Double getSurface() { return surface; }
    public void setSurface(Double surface) { this.surface = surface; }

    public Integer getNombrePieces() { return nombrePieces; }
    public void setNombrePieces(Integer nombrePieces) { this.nombrePieces = nombrePieces; }

    public Integer getEtage() { return etage; }
    public void setEtage(Integer etage) { this.etage = etage; }

    public Double getLoyerBase() { return loyerBase; }
    public void setLoyerBase(Double loyerBase) { this.loyerBase = loyerBase; }

    public Double getCaution() { return caution; }
    public void setCaution(Double caution) { this.caution = caution; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getDateAjout() { return dateAjout; }
    public void setDateAjout(Date dateAjout) { this.dateAjout = dateAjout; }

    public Foyer getFoyer() { return foyer; }
    public void setFoyer(Foyer foyer) { this.foyer = foyer; }
}