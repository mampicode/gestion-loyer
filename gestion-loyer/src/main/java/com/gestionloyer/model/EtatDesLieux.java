package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "etat_des_lieux")
public class EtatDesLieux {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_etat")
    private Long idEtat;

    @Column(name = "type_etat", nullable = false, length = 20)
    private String typeEtat; // ENTREE ou SORTIE

    @Column(name = "date_etat")
    @Temporal(TemporalType.DATE)
    private Date dateEtat = new Date();

    @Column(name = "observations", length = 1000)
    private String observations;

    @Column(name = "etat_general", length = 50)
    private String etatGeneral;

    @ManyToOne
    @JoinColumn(name = "id_contrat", nullable = false)
    private ContratLocation contrat;

    public EtatDesLieux() {}

    public Long getIdEtat() { return idEtat; }
    public void setIdEtat(Long idEtat) { this.idEtat = idEtat; }

    public String getTypeEtat() { return typeEtat; }
    public void setTypeEtat(String typeEtat) { this.typeEtat = typeEtat; }

    public Date getDateEtat() { return dateEtat; }
    public void setDateEtat(Date dateEtat) { this.dateEtat = dateEtat; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public String getEtatGeneral() { return etatGeneral; }
    public void setEtatGeneral(String etatGeneral) { this.etatGeneral = etatGeneral; }

    public ContratLocation getContrat() { return contrat; }
    public void setContrat(ContratLocation contrat) { this.contrat = contrat; }
}