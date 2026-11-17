package com.gestionloyer.model;
import jakarta.persistence.*;

@Entity
@Table(name = "role")

public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_role")
    private Long idRole;

    @Column(name = "libelle",nullable = false,unique = true,length = 50)
    private String libelle;

    @Column(name = "description", length = 255)
    private String description;

    //Constructeur vide (obligatoire pour JPA)
    public Role() {

    }
    public  Role (String libelle,String description){
        this.libelle = libelle;
        this.description = description;
    }

    //Getters et Setters
    public Long getIdRole(){
        return idRole;
    }
    public  void setIdRole(Long idRole){
        this.idRole = idRole;
    }

    public String getLibelle(){
        return libelle;
    }

    public void setLibelle(String libelle){
        this.libelle = libelle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
