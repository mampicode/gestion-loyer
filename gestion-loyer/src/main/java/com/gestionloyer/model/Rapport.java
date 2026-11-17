package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "rapport")
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rapport")
    private Long idRapport;

    @Column(name = "titre", length = 150)
    private String titre;

    @Column(name = "type_rapport", length = 50)
    private String typeRapport; // IMPAYES, CA_MENSUEL, OCCUPATION...

    @Column(name = "date_debut")
    @Temporal(TemporalType.DATE)
    private Date dateDebut;

    @Column(name = "date_fin")
    @Temporal(TemporalType.DATE)
    private Date dateFin;

    @Column(name = "date_generation")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateGeneration = new Date();

    @Column(name = "fichier_pdf", length = 255)
    private String fichierPdf;

    @ManyToOne
    @JoinColumn(name = "id_admin")
    private Admin admin;

    public Rapport() {}

    public Long getIdRapport() { return idRapport; }
    public void setIdRapport(Long idRapport) { this.idRapport = idRapport; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getTypeRapport() { return typeRapport; }
    public void setTypeRapport(String typeRapport) { this.typeRapport = typeRapport; }

    public Date getDateDebut() { return dateDebut; }
    public void setDateDebut(Date dateDebut) { this.dateDebut = dateDebut; }

    public Date getDateFin() { return dateFin; }
    public void setDateFin(Date dateFin) { this.dateFin = dateFin; }

    public Date getDateGeneration() { return dateGeneration; }
    public void setDateGeneration(Date dateGeneration) { this.dateGeneration = dateGeneration; }

    public String getFichierPdf() { return fichierPdf; }
    public void setFichierPdf(String fichierPdf) { this.fichierPdf = fichierPdf; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }
}