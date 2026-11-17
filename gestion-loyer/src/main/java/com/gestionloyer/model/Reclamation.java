package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "reclamation")
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reclamation")
    private Long idReclamation;

    @Column(name = "titre", nullable = false, length = 150)
    private String titre;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "date_creation")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation = new Date();

    @Column(name = "priorite", length = 20)
    private String priorite = "MOYENNE";

    @Column(name = "statut", length = 30)
    private String statut = "OUVERTE";

    @Column(name = "type_reclamation", length = 50)
    private String typeReclamation;

    @Column(name = "date_resolution")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateResolution;

    @ManyToOne
    @JoinColumn(name = "id_locataire", nullable = false)
    private Locataire locataire;

    @ManyToOne
    @JoinColumn(name = "id_lot")
    private Lot lot;

    public Reclamation() {}

    public Long getIdReclamation() { return idReclamation; }
    public void setIdReclamation(Long idReclamation) { this.idReclamation = idReclamation; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getDateCreation() { return dateCreation; }
    public void setDateCreation(Date dateCreation) { this.dateCreation = dateCreation; }

    public String getPriorite() { return priorite; }
    public void setPriorite(String priorite) { this.priorite = priorite; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getTypeReclamation() { return typeReclamation; }
    public void setTypeReclamation(String typeReclamation) { this.typeReclamation = typeReclamation; }

    public Date getDateResolution() { return dateResolution; }
    public void setDateResolution(Date dateResolution) { this.dateResolution = dateResolution; }

    public Locataire getLocataire() { return locataire; }
    public void setLocataire(Locataire locataire) { this.locataire = locataire; }

    public Lot getLot() { return lot; }
    public void setLot(Lot lot) { this.lot = lot; }
}