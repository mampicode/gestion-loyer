package com.gestionloyer.model;
import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {
    @Id
    @Column(name = "id_utilisateur")
    private Long idUtilisateur;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;

    public Admin() {
    }

    public Admin(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
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
}
