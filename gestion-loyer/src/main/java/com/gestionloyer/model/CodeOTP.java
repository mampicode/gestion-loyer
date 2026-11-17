package com.gestionloyer.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "code_otp")
public class CodeOTP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_code")
    private Long idCode;

    @Column(name = "code", nullable = false, length = 10)
    private String code;

    @Column(name = "date_expiration", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateExpiration;

    @Column(name = "utilise", length = 1)
    private String utilise = "N";

    @Column(name = "type_otp", length = 30)
    private String typeOtp;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;

    public CodeOTP() {
    }

    public Long getIdCode() {
        return idCode;
    }

    public void setIdCode(Long idCode) {
        this.idCode = idCode;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Date getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(Date dateExpiration) {
        this.dateExpiration = dateExpiration;
    }

    public String getUtilise() {
        return utilise;
    }

    public void setUtilise(String utilise) {
        this.utilise = utilise;
    }

    public String getTypeOtp() {
        return typeOtp;
    }

    public void setTypeOtp(String typeOtp) {
        this.typeOtp = typeOtp;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}
