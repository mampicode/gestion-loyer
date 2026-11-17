package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "foyer")
public class Foyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_foyer")
    private Long idFoyer;

    @Column(name = "nom", nullable = false, length = 150)
    private String nom;

    @Column(name = "type_foyer", length = 50)
    private String typeFoyer;

    @Column(name = "adresse", nullable = false, length = 255)
    private String adresse;

    @Column(name = "ville", length = 100)
    private String ville;

    @Column(name = "quartier", length = 100)
    private String quartier;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "date_ajout")
    @Temporal(TemporalType.DATE)
    private Date dateAjout = new Date();

    @Column(name = "statut", length = 20)
    private String statut = "ACTIF";

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    public Foyer() {}

    public Long getIdFoyer() { return idFoyer; }
    public void setIdFoyer(Long idFoyer) { this.idFoyer = idFoyer; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getTypeFoyer() { return typeFoyer; }
    public void setTypeFoyer(String typeFoyer) { this.typeFoyer = typeFoyer; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getQuartier() { return quartier; }
    public void setQuartier(String quartier) { this.quartier = quartier; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getDateAjout() { return dateAjout; }
    public void setDateAjout(Date dateAjout) { this.dateAjout = dateAjout; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}