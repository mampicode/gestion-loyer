package com.gestionloyer.repository;

import com.gestionloyer.model.CodeOTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodeOTPRepository extends JpaRepository<CodeOTP, Long> {
    Optional<CodeOTP> findByCodeAndUtilise(String code, String utilise);
}