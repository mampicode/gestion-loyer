package com.gestionloyer.model;
 import jakarta.persistence.*;
 import java.util.Date;

 @Entity
 @Table(name = "locataire")
public class Locataire {
     @Id
     @Column(name = "id_utilisateur")
     private Long idUtilisateur;

     @OneToOne
     @MapsId
     @JoinColumn(name = "id_utilisateur")
     private Utilisateur utilisateur;

     @Column(name = "adresse", length = 255)
     private String adresse;

     @Column(name = "piece_identite", length = 100)
     private String pieceIdentite;

     @Column(name = "date_naissance")
     @Temporal(TemporalType.DATE)
     private Date dateNaissance;

     public Locataire() {
     }

     public Long getIdUtilisateur() {
         return idUtilisateur;
     }

     public void setIdUtilisateur(Long idUtilisateur) {
         this.idUtilisateur = idUtilisateur;
     }

     public Utilisateur getUtilisateur() {
         return utilisateur;
     }

     public void setUtilisateur(Utilisateur utilisateur) {
         this.utilisateur = utilisateur;
     }

     public String getAdresse() {
         return adresse;
     }

     public void setAdresse(String adresse) {
         this.adresse = adresse;
     }

     public String getPieceIdentite() {
         return pieceIdentite;
     }

     public void setPieceIdentite(String pieceIdentite) {
         this.pieceIdentite = pieceIdentite;
     }

     public Date getDateNaissance() {
         return dateNaissance;
     }

     public void setDateNaissance(Date dateNaissance) {
         this.dateNaissance = dateNaissance;
     }
}
