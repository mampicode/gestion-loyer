package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_document")
    private Long idDocument;

    @Column(name = "nom", nullable = false, length = 150)
    private String nom;

    @Column(name = "type_document", length = 50)
    private String typeDocument; // CIN, CONTRAT, QUITTANCE, PHOTO...

    @Column(name = "chemin_fichier", length = 255)
    private String cheminFichier;

    @Column(name = "date_ajout")
    @Temporal(TemporalType.DATE)
    private Date dateAjout = new Date();

    @Column(name = "taille")
    private Long taille;

    @Column(name = "format", length = 20)
    private String format; // JPG, PNG, PDF

    @ManyToOne
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "id_contrat")
    private ContratLocation contrat;

    @ManyToOne
    @JoinColumn(name = "id_paiement")
    private Paiement paiement;

    public Document() {}

    public Long getIdDocument() { return idDocument; }
    public void setIdDocument(Long idDocument) { this.idDocument = idDocument; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getTypeDocument() { return typeDocument; }
    public void setTypeDocument(String typeDocument) { this.typeDocument = typeDocument; }

    public String getCheminFichier() { return cheminFichier; }
    public void setCheminFichier(String cheminFichier) { this.cheminFichier = cheminFichier; }

    public Date getDateAjout() { return dateAjout; }
    public void setDateAjout(Date dateAjout) { this.dateAjout = dateAjout; }

    public Long getTaille() { return taille; }
    public void setTaille(Long taille) { this.taille = taille; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public ContratLocation getContrat() { return contrat; }
    public void setContrat(ContratLocation contrat) { this.contrat = contrat; }

    public Paiement getPaiement() { return paiement; }
    public void setPaiement(Paiement paiement) { this.paiement = paiement; }
}