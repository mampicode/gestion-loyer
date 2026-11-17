-- Script de données de démonstration pour la base Oracle GESTION_LOYER
-- Idempotent : exécutable plusieurs fois sans conflit de clés.

PROMPT Insertion des rôles...
MERGE INTO ROLE r
USING (
    SELECT 1 AS id_role, 'ADMIN' AS libelle, 'Gestionnaire de l''application' AS description FROM dual
    UNION ALL
    SELECT 2 AS id_role, 'LOCATAIRE' AS libelle, 'Locataire du parc immobilier' AS description FROM dual
    UNION ALL
    SELECT 3 AS id_role, 'SUPPORT' AS libelle, 'Support client' AS description FROM dual
) s
ON (r.id_role = s.id_role)
WHEN NOT MATCHED THEN
    INSERT (id_role, libelle, description)
    VALUES (s.id_role, s.libelle, s.description);

PROMPT Insertion des utilisateurs...
MERGE INTO UTILISATEUR u
USING (
    SELECT 1 AS id_utilisateur, 'Admin' AS nom, 'Principal' AS prenom, 'admin@mail.com' AS email,
           '+261341000001' AS telephone, '123456' AS mot_de_passe, 'ACTIF' AS statut,
           TO_DATE('2026-01-15','YYYY-MM-DD') AS date_creation, TO_DATE('2026-11-16 09:30','YYYY-MM-DD HH24:MI') AS derniere_connexion, 1 AS id_role FROM dual
    UNION ALL
    SELECT 101 AS id_utilisateur, 'Rakoto' AS nom, 'Aina' AS prenom, 'aina.rakoto@gmail.com' AS email,
           '+261341111001' AS telephone, '123456' AS mot_de_passe, 'ACTIF' AS statut,
           TO_DATE('2026-02-02','YYYY-MM-DD') AS date_creation, TO_DATE('2026-11-10 08:15','YYYY-MM-DD HH24:MI') AS derniere_connexion, 2 AS id_role FROM dual
    UNION ALL
    SELECT 102 AS id_utilisateur, 'Randria' AS nom, 'Benoit' AS prenom, 'benoit.randria@gmail.com' AS email,
           '+261341111002' AS telephone, '123456' AS mot_de_passe, 'ACTIF' AS statut,
           TO_DATE('2026-02-03','YYYY-MM-DD') AS date_creation, TO_DATE('2026-11-11 09:00','YYYY-MM-DD HH24:MI') AS derniere_connexion, 2 AS id_role FROM dual
    UNION ALL
    SELECT 103 AS id_utilisateur, 'Andrianaivo' AS nom, 'Celia' AS prenom, 'celia.andrianaivo@gmail.com' AS email,
           '+261341111003' AS telephone, '123456' AS mot_de_passe, 'ACTIF' AS statut,
           TO_DATE('2026-02-04','YYYY-MM-DD') AS date_creation, TO_DATE('2026-11-12 10:30','YYYY-MM-DD HH24:MI') AS derniere_connexion, 2 AS id_role FROM dual
    UNION ALL
    SELECT 104 AS id_utilisateur, 'Rabe' AS nom, 'Dylan' AS prenom, 'dylan.rabe@gmail.com' AS email,
           '+261341111004' AS telephone, '123456' AS mot_de_passe, 'ACTIF' AS statut,
           TO_DATE('2026-03-01','YYYY-MM-DD') AS date_creation, TO_DATE('2026-11-13 12:00','YYYY-MM-DD HH24:MI') AS derniere_connexion, 2 AS id_role FROM dual
) s
ON (u.id_utilisateur = s.id_utilisateur)
WHEN NOT MATCHED THEN
    INSERT (id_utilisateur, nom, prenom, email, telephone, mot_de_passe, statut, date_creation, derniere_connexion, id_role)
    VALUES (s.id_utilisateur, s.nom, s.prenom, s.email, s.telephone, s.mot_de_passe, s.statut, s.date_creation, s.derniere_connexion, s.id_role);

PROMPT Insertion des comptes admin et locataire...
MERGE INTO ADMIN a
USING (SELECT 1 AS id_utilisateur FROM dual) s
ON (a.id_utilisateur = s.id_utilisateur)
WHEN NOT MATCHED THEN
    INSERT (id_utilisateur)
    VALUES (s.id_utilisateur);

MERGE INTO LOCATAIRE l
USING (
    SELECT 101 AS id_utilisateur, 'Lot 12, Rue de l''Eglise, Antananarivo' AS adresse,
           'CIN 10124567' AS piece_identite, TO_DATE('1990-04-15','YYYY-MM-DD') AS date_naissance FROM dual
    UNION ALL
    SELECT 102 AS id_utilisateur, 'Lot 23, Rue du Lac, Antsirabe' AS adresse,
           'CIN 10224568' AS piece_identite, TO_DATE('1992-07-20','YYYY-MM-DD') AS date_naissance FROM dual
    UNION ALL
    SELECT 103 AS id_utilisateur, 'Lot 8, Avenue de la République, Toamasina' AS adresse,
           'CIN 10324569' AS piece_identite, TO_DATE('1988-11-01','YYYY-MM-DD') AS date_naissance FROM dual
    UNION ALL
    SELECT 104 AS id_utilisateur, 'Lot 44, Rue des Cocotiers, Fianarantsoa' AS adresse,
           'CIN 10424570' AS piece_identite, TO_DATE('1995-02-18','YYYY-MM-DD') AS date_naissance FROM dual
) s
ON (l.id_utilisateur = s.id_utilisateur)
WHEN NOT MATCHED THEN
    INSERT (id_utilisateur, adresse, piece_identite, date_naissance)
    VALUES (s.id_utilisateur, s.adresse, s.piece_identite, s.date_naissance);

PROMPT Insertion des foyers...
MERGE INTO FOYER f
USING (
    SELECT 101 AS id_foyer, 'Foyer Alpha' AS nom, 'APPARTEMENT' AS type_foyer,
           'Avenue de l''Indépendance 12, Antananarivo' AS adresse, 'Antananarivo' AS ville,
           'Analamanga' AS quartier, 'Foyer moderne avec gardien' AS description,
           TO_DATE('2025-01-09','YYYY-MM-DD') AS date_ajout, 'ACTIF' AS statut, -18.8792 AS latitude, 47.5079 AS longitude FROM dual
    UNION ALL
    SELECT 102 AS id_foyer, 'Foyer Beta' AS nom, 'MAISON' AS type_foyer,
           'Rue du Lac 23, Antsirabe' AS adresse, 'Antsirabe' AS ville,
           'Vakinankaratra' AS quartier, 'Maison familiale sécurisée' AS description,
           TO_DATE('2025-02-12','YYYY-MM-DD') AS date_ajout, 'ACTIF' AS statut, -19.8722 AS latitude, 47.0460 AS longitude FROM dual
    UNION ALL
    SELECT 103 AS id_foyer, 'Foyer Gamma' AS nom, 'STUDIO' AS type_foyer,
           'Avenue de la République 8, Toamasina' AS adresse, 'Toamasina' AS ville,
           'Plaisance' AS quartier, 'Studio fonctionnel pour étudiants' AS description,
           TO_DATE('2025-03-18','YYYY-MM-DD') AS date_ajout, 'ACTIF' AS statut, -18.1492 AS latitude, 49.4010 AS longitude FROM dual
) s
ON (f.id_foyer = s.id_foyer)
WHEN NOT MATCHED THEN
    INSERT (id_foyer, nom, type_foyer, adresse, ville, quartier, description, date_ajout, statut, latitude, longitude)
    VALUES (s.id_foyer, s.nom, s.type_foyer, s.adresse, s.ville, s.quartier, s.description, s.date_ajout, s.statut, s.latitude, s.longitude);

PROMPT Insertion des lots...
MERGE INTO LOT l
USING (
    SELECT 101 AS id_lot, 'A101' AS numero, 'APPARTEMENT' AS type_lot, 42.5 AS surface, 2 AS nombre_pieces, 1 AS etage, 350000 AS loyer_base, 500000 AS caution,
           'OCCUPE' AS statut, 'Lot occupé par un couple' AS description, TO_DATE('2025-01-15','YYYY-MM-DD') AS date_ajout, 101 AS id_foyer FROM dual
    UNION ALL
    SELECT 102 AS id_lot, 'A102' AS numero, 'APPARTEMENT' AS type_lot, 40.0 AS surface, 2 AS nombre_pieces, 1 AS etage, 320000 AS loyer_base, 480000 AS caution,
           'LIBRE' AS statut, 'Lot disponible' AS description, TO_DATE('2025-01-16','YYYY-MM-DD') AS date_ajout, 101 AS id_foyer FROM dual
    UNION ALL
    SELECT 103 AS id_lot, 'B201' AS numero, 'MAISON' AS type_lot, 70.0 AS surface, 3 AS nombre_pieces, 2 AS etage, 520000 AS loyer_base, 700000 AS caution,
           'OCCUPE' AS statut, 'Maison familiale occupée' AS description, TO_DATE('2025-02-15','YYYY-MM-DD') AS date_ajout, 102 AS id_foyer FROM dual
    UNION ALL
    SELECT 104 AS id_lot, 'C301' AS numero, 'STUDIO' AS type_lot, 28.0 AS surface, 1 AS nombre_pieces, 3 AS etage, 250000 AS loyer_base, 350000 AS caution,
           'OCCUPE' AS statut, 'Studio occupé' AS description, TO_DATE('2025-03-15','YYYY-MM-DD') AS date_ajout, 103 AS id_foyer FROM dual
    UNION ALL
    SELECT 105 AS id_lot, 'C302' AS numero, 'STUDIO' AS type_lot, 29.0 AS surface, 1 AS nombre_pieces, 3 AS etage, 260000 AS loyer_base, 380000 AS caution,
           'LIBRE' AS statut, 'Studio libre' AS description, TO_DATE('2025-03-18','YYYY-MM-DD') AS date_ajout, 103 AS id_foyer FROM dual
) s
ON (l.id_lot = s.id_lot)
WHEN NOT MATCHED THEN
    INSERT (id_lot, numero, type_lot, surface, nombre_pieces, etage, loyer_base, caution, statut, description, date_ajout, id_foyer)
    VALUES (s.id_lot, s.numero, s.type_lot, s.surface, s.nombre_pieces, s.etage, s.loyer_base, s.caution, s.statut, s.description, s.date_ajout, s.id_foyer);

PROMPT Insertion des contrats de location...
MERGE INTO CONTRAT_LOCATION c
USING (
    SELECT 101 AS id_contrat, TO_DATE('2026-01-01','YYYY-MM-DD') AS date_debut, TO_DATE('2027-01-01','YYYY-MM-DD') AS date_fin,
           350000 AS montant_loyer, 500000 AS caution, 12 AS duree, 'EN_COURS' AS statut,
           TO_DATE('2025-12-28','YYYY-MM-DD') AS date_signature, 'N' AS renouvellement_automatique, 101 AS id_locataire, 101 AS id_lot FROM dual
    UNION ALL
    SELECT 102 AS id_contrat, TO_DATE('2026-02-01','YYYY-MM-DD') AS date_debut, TO_DATE('2027-02-01','YYYY-MM-DD') AS date_fin,
           520000 AS montant_loyer, 700000 AS caution, 12 AS duree, 'EN_COURS' AS statut,
           TO_DATE('2026-01-28','YYYY-MM-DD') AS date_signature, 'O' AS renouvellement_automatique, 102 AS id_locataire, 103 AS id_lot FROM dual
    UNION ALL
    SELECT 103 AS id_contrat, TO_DATE('2026-03-01','YYYY-MM-DD') AS date_debut, TO_DATE('2027-03-01','YYYY-MM-DD') AS date_fin,
           250000 AS montant_loyer, 350000 AS caution, 12 AS duree, 'EN_COURS' AS statut,
           TO_DATE('2026-02-28','YYYY-MM-DD') AS date_signature, 'N' AS renouvellement_automatique, 103 AS id_locataire, 104 AS id_lot FROM dual
) s
ON (c.id_contrat = s.id_contrat)
WHEN NOT MATCHED THEN
    INSERT (id_contrat, date_debut, date_fin, montant_loyer, caution, duree, statut, date_signature, renouvellement_automatique, id_locataire, id_lot)
    VALUES (s.id_contrat, s.date_debut, s.date_fin, s.montant_loyer, s.caution, s.duree, s.statut, s.date_signature, s.renouvellement_automatique, s.id_locataire, s.id_lot);

PROMPT Insertion des paiements...
MERGE INTO PAIEMENT p
USING (
    SELECT 101 AS id_paiement, 350000 AS montant, TO_DATE('2026-11-01','YYYY-MM-DD') AS date_paiement, 'VIREMENT' AS mode_paiement, '2026-11' AS periode,
           'VALIDE' AS statut, 'REF-PAI-101' AS reference, TO_DATE('2026-11-01','YYYY-MM-DD') AS date_creation, 'Q-101' AS numero_quittance,
           TO_DATE('2026-11-02','YYYY-MM-DD') AS date_emission_quittance, 'quittance-101.pdf' AS fichier_pdf, 101 AS id_contrat FROM dual
    UNION ALL
    SELECT 102 AS id_paiement, 520000 AS montant, TO_DATE('2026-11-05','YYYY-MM-DD') AS date_paiement, 'MOBILE_MONEY' AS mode_paiement, '2026-11' AS periode,
           'VALIDE' AS statut, 'REF-PAI-102' AS reference, TO_DATE('2026-11-05','YYYY-MM-DD') AS date_creation, 'Q-102' AS numero_quittance,
           TO_DATE('2026-11-06','YYYY-MM-DD') AS date_emission_quittance, 'quittance-102.pdf' AS fichier_pdf, 102 AS id_contrat FROM dual
    UNION ALL
    SELECT 103 AS id_paiement, 250000 AS montant, TO_DATE('2026-10-28','YYYY-MM-DD') AS date_paiement, 'ESPECES' AS mode_paiement, '2026-10' AS periode,
           'VALIDE' AS statut, 'REF-PAI-103' AS reference, TO_DATE('2026-10-28','YYYY-MM-DD') AS date_creation, 'Q-103' AS numero_quittance,
           TO_DATE('2026-10-29','YYYY-MM-DD') AS date_emission_quittance, 'quittance-103.pdf' AS fichier_pdf, 103 AS id_contrat FROM dual
    UNION ALL
    SELECT 104 AS id_paiement, 350000 AS montant, TO_DATE('2026-09-01','YYYY-MM-DD') AS date_paiement, 'VIREMENT' AS mode_paiement, '2026-09' AS periode,
           'VALIDE' AS statut, 'REF-PAI-104' AS reference, TO_DATE('2026-09-01','YYYY-MM-DD') AS date_creation, 'Q-104' AS numero_quittance,
           TO_DATE('2026-09-02','YYYY-MM-DD') AS date_emission_quittance, 'quittance-104.pdf' AS fichier_pdf, 101 AS id_contrat FROM dual
) s
ON (p.id_paiement = s.id_paiement)
WHEN NOT MATCHED THEN
    INSERT (id_paiement, montant, date_paiement, mode_paiement, periode, statut, reference, date_creation, numero_quittance, date_emission_quittance, fichier_pdf, id_contrat)
    VALUES (s.id_paiement, s.montant, s.date_paiement, s.mode_paiement, s.periode, s.statut, s.reference, s.date_creation, s.numero_quittance, s.date_emission_quittance, s.fichier_pdf, s.id_contrat);

PROMPT Insertion des impayés...
MERGE INTO IMPAYE i
USING (
    SELECT 101 AS id_impaye, 60000 AS montant_du, 45000 AS montant_restant, TO_DATE('2026-10-05','YYYY-MM-DD') AS date_echeance, 12 AS nombre_jours_retard,
           2500 AS penalite, 'EN_COURS' AS statut, TO_DATE('2026-10-10','YYYY-MM-DD') AS date_creation, NULL AS date_reglement, 102 AS id_contrat FROM dual
    UNION ALL
    SELECT 102 AS id_impaye, 80000 AS montant_du, 80000 AS montant_restant, TO_DATE('2026-11-05','YYYY-MM-DD') AS date_echeance, 20 AS nombre_jours_retard,
           4200 AS penalite, 'EN_COURS' AS statut, TO_DATE('2026-11-08','YYYY-MM-DD') AS date_creation, NULL AS date_reglement, 103 AS id_contrat FROM dual
) s
ON (i.id_impaye = s.id_impaye)
WHEN NOT MATCHED THEN
    INSERT (id_impaye, montant_du, montant_restant, date_echeance, nombre_jours_retard, penalite, statut, date_creation, date_reglement, id_contrat)
    VALUES (s.id_impaye, s.montant_du, s.montant_restant, s.date_echeance, s.nombre_jours_retard, s.penalite, s.statut, s.date_creation, s.date_reglement, s.id_contrat);

PROMPT Insertion des réclamations...
MERGE INTO RECLAMATION r
USING (
    SELECT 101 AS id_reclamation, 'Fuite d''eau' AS titre, 'Il y a une fuite dans la salle de bain du lot A101.' AS description,
           TO_TIMESTAMP('2026-11-06 08:00:00','YYYY-MM-DD HH24:MI:SS') AS date_creation, 'HAUTE' AS priorite, 'OUVERTE' AS statut,
           'PLUMBING' AS type_reclamation, NULL AS date_resolution, 101 AS id_locataire, 101 AS id_lot FROM dual
    UNION ALL
    SELECT 102 AS id_reclamation, 'Bruits de voisinage' AS titre, 'Le bruit est excessif en fin de nuit.' AS description,
           TO_TIMESTAMP('2026-11-10 15:30:00','YYYY-MM-DD HH24:MI:SS') AS date_creation, 'MOYENNE' AS priorite, 'EN_COURS' AS statut,
           'NOISE' AS type_reclamation, NULL AS date_resolution, 102 AS id_locataire, 103 AS id_lot FROM dual
) s
ON (r.id_reclamation = s.id_reclamation)
WHEN NOT MATCHED THEN
    INSERT (id_reclamation, titre, description, date_creation, priorite, statut, type_reclamation, date_resolution, id_locataire, id_lot)
    VALUES (s.id_reclamation, s.titre, s.description, s.date_creation, s.priorite, s.statut, s.type_reclamation, s.date_resolution, s.id_locataire, s.id_lot);

PROMPT Insertion des notifications...
MERGE INTO NOTIFICATION n
USING (
    SELECT 101 AS id_notification, 'Paiement reçu' AS titre, 'Paiement de 350000 Ar validé pour le mois de novembre.' AS message,
           'EMAIL' AS type_notif, TO_TIMESTAMP('2026-11-02 09:00:00','YYYY-MM-DD HH24:MI:SS') AS date_envoi, 'N' AS lu, 'ENVOYEE' AS statut, 101 AS id_utilisateur FROM dual
    UNION ALL
    SELECT 102 AS id_notification, 'Relance impayé' AS titre, 'Un paiement est en retard et doit être régularisé.' AS message,
           'SMS' AS type_notif, TO_TIMESTAMP('2026-11-08 10:15:00','YYYY-MM-DD HH24:MI:SS') AS date_envoi, 'N' AS lu, 'ENVOYEE' AS statut, 102 AS id_utilisateur FROM dual
    UNION ALL
    SELECT 103 AS id_notification, 'Réclamation traitée' AS titre, 'Votre réclamation a été mise en cours de traitement.' AS message,
           'APP' AS type_notif, TO_TIMESTAMP('2026-11-12 13:00:00','YYYY-MM-DD HH24:MI:SS') AS date_envoi, 'O' AS lu, 'LUE' AS statut, 103 AS id_utilisateur FROM dual
) s
ON (n.id_notification = s.id_notification)
WHEN NOT MATCHED THEN
    INSERT (id_notification, titre, message, type_notif, date_envoi, lu, statut, id_utilisateur)
    VALUES (s.id_notification, s.titre, s.message, s.type_notif, s.date_envoi, s.lu, s.statut, s.id_utilisateur);

PROMPT Insertion des charges...
MERGE INTO CHARGE c
USING (
    SELECT 101 AS id_charge, 'Eau' AS libelle, 'SERVICE' AS type_charge, 25000 AS montant, '2026-11' AS periode, 'O' AS recuperable,
           TO_DATE('2026-11-01','YYYY-MM-DD') AS date_creation, 101 AS id_foyer, NULL AS id_lot FROM dual
    UNION ALL
    SELECT 102 AS id_charge, 'Electricité' AS libelle, 'SERVICE' AS type_charge, 42000 AS montant, '2026-11' AS periode, 'O' AS recuperable,
           TO_DATE('2026-11-03','YYYY-MM-DD') AS date_creation, 102 AS id_foyer, 103 AS id_lot FROM dual
) s
ON (c.id_charge = s.id_charge)
WHEN NOT MATCHED THEN
    INSERT (id_charge, libelle, type_charge, montant, periode, recuperable, date_creation, id_foyer, id_lot)
    VALUES (s.id_charge, s.libelle, s.type_charge, s.montant, s.periode, s.recuperable, s.date_creation, s.id_foyer, s.id_lot);

PROMPT Insertion des documents...
MERGE INTO DOCUMENT d
USING (
    SELECT 101 AS id_document, 'contrat-A101.pdf' AS nom, 'CONTRAT' AS type_document, '/documents/contrats/contrat-A101.pdf' AS chemin_fichier,
           TO_DATE('2026-11-01','YYYY-MM-DD') AS date_ajout, 120000 AS taille, 'PDF' AS format, 101 AS id_utilisateur, 101 AS id_contrat, NULL AS id_paiement FROM dual
    UNION ALL
    SELECT 102 AS id_document, 'quittance-102.pdf' AS nom, 'QUITTANCE' AS type_document, '/documents/quittances/quittance-102.pdf' AS chemin_fichier,
           TO_DATE('2026-11-06','YYYY-MM-DD') AS date_ajout, 86000 AS taille, 'PDF' AS format, 102 AS id_utilisateur, 102 AS id_contrat, 102 AS id_paiement FROM dual
) s
ON (d.id_document = s.id_document)
WHEN NOT MATCHED THEN
    INSERT (id_document, nom, type_document, chemin_fichier, date_ajout, taille, format, id_utilisateur, id_contrat, id_paiement)
    VALUES (s.id_document, s.nom, s.type_document, s.chemin_fichier, s.date_ajout, s.taille, s.format, s.id_utilisateur, s.id_contrat, s.id_paiement);

PROMPT Insertion des états des lieux...
MERGE INTO ETAT_DES_LIEUX e
USING (
    SELECT 101 AS id_etat, 'ENTREE' AS type_etat, TO_DATE('2026-01-02','YYYY-MM-DD') AS date_etat, 'Bien en état général correct' AS observations, 'BON' AS etat_general, 101 AS id_contrat FROM dual
    UNION ALL
    SELECT 102 AS id_etat, 'SORTIE' AS type_etat, TO_DATE('2026-11-15','YYYY-MM-DD') AS date_etat, 'A revoir la plomberie de la salle de bain' AS observations, 'CORRECTIF' AS etat_general, 101 AS id_contrat FROM dual
) s
ON (e.id_etat = s.id_etat)
WHEN NOT MATCHED THEN
    INSERT (id_etat, type_etat, date_etat, observations, etat_general, id_contrat)
    VALUES (s.id_etat, s.type_etat, s.date_etat, s.observations, s.etat_general, s.id_contrat);

PROMPT Insertion des historiques de connexion...
MERGE INTO HISTORIQUE_CONNEXION h
USING (
    SELECT 101 AS id_historique, TO_TIMESTAMP('2026-11-16 08:30:00','YYYY-MM-DD HH24:MI:SS') AS date_connexion, '192.168.1.10' AS adresse_ip, 'Windows 11' AS appareil,
           'Chrome' AS navigateur, 'O' AS succes, 1 AS id_utilisateur FROM dual
    UNION ALL
    SELECT 102 AS id_historique, TO_TIMESTAMP('2026-11-16 09:15:00','YYYY-MM-DD HH24:MI:SS') AS date_connexion, '192.168.1.15' AS adresse_ip, 'Android' AS appareil,
           'Samsung Internet' AS navigateur, 'O' AS succes, 101 AS id_utilisateur FROM dual
) s
ON (h.id_historique = s.id_historique)
WHEN NOT MATCHED THEN
    INSERT (id_historique, date_connexion, adresse_ip, appareil, navigateur, succes, id_utilisateur)
    VALUES (s.id_historique, s.date_connexion, s.adresse_ip, s.appareil, s.navigateur, s.succes, s.id_utilisateur);

PROMPT Insertion des codes OTP...
MERGE INTO CODE_OTP c
USING (
    SELECT 101 AS id_code, '846321' AS code, TO_TIMESTAMP('2026-11-17 09:00:00','YYYY-MM-DD HH24:MI:SS') AS date_expiration, 'N' AS utilise, 'RESET_PASSWORD' AS type_otp, 101 AS id_utilisateur FROM dual
    UNION ALL
    SELECT 102 AS id_code, '741258' AS code, TO_TIMESTAMP('2026-11-18 10:00:00','YYYY-MM-DD HH24:MI:SS') AS date_expiration, 'N' AS utilise, 'LOGIN' AS type_otp, 102 AS id_utilisateur FROM dual
) s
ON (c.id_code = s.id_code)
WHEN NOT MATCHED THEN
    INSERT (id_code, code, date_expiration, utilise, type_otp, id_utilisateur)
    VALUES (s.id_code, s.code, s.date_expiration, s.utilise, s.type_otp, s.id_utilisateur);

PROMPT Insertion des rapports...
MERGE INTO RAPPORT r
USING (
    SELECT 101 AS id_rapport, 'Rapport CA novembre' AS titre, 'CA_MENSUEL' AS type_rapport, TO_DATE('2026-11-01','YYYY-MM-DD') AS date_debut,
           TO_DATE('2026-11-30','YYYY-MM-DD') AS date_fin, TO_TIMESTAMP('2026-11-30 18:00:00','YYYY-MM-DD HH24:MI:SS') AS date_generation,
           '/rapports/ca_novembre_2026.pdf' AS fichier_pdf, 1 AS id_admin FROM dual
    UNION ALL
    SELECT 102 AS id_rapport, 'Rapport impayés' AS titre, 'IMPAYES' AS type_rapport, TO_DATE('2026-11-01','YYYY-MM-DD') AS date_debut,
           TO_DATE('2026-11-30','YYYY-MM-DD') AS date_fin, TO_TIMESTAMP('2026-11-30 18:05:00','YYYY-MM-DD HH24:MI:SS') AS date_generation,
           '/rapports/impayes_novembre_2026.pdf' AS fichier_pdf, 1 AS id_admin FROM dual
) s
ON (r.id_rapport = s.id_rapport)
WHEN NOT MATCHED THEN
    INSERT (id_rapport, titre, type_rapport, date_debut, date_fin, date_generation, fichier_pdf, id_admin)
    VALUES (s.id_rapport, s.titre, s.type_rapport, s.date_debut, s.date_fin, s.date_generation, s.fichier_pdf, s.id_admin);

PROMPT Insertion des relances...
MERGE INTO RELANCE r
USING (
    SELECT 101 AS id_relance, 1 AS niveau, 'SMS' AS canal, 'Bonjour, votre paiement est en retard, merci de régulariser votre situation.' AS message,
           TO_TIMESTAMP('2026-11-09 08:00:00','YYYY-MM-DD HH24:MI:SS') AS date_envoi, 'ENVOYEE' AS statut, 7 AS jours_retard, 101 AS id_impaye,
           102 AS id_contrat, 1 AS id_utilisateur FROM dual
    UNION ALL
    SELECT 102 AS id_relance, 2 AS niveau, 'EMAIL' AS canal, 'Nous vous invitons à régler votre dette avant la fin de semaine.' AS message,
           TO_TIMESTAMP('2026-11-12 10:00:00','YYYY-MM-DD HH24:MI:SS') AS date_envoi, 'ENVOYEE' AS statut, 15 AS jours_retard, 102 AS id_impaye,
           103 AS id_contrat, 101 AS id_utilisateur FROM dual
) s
ON (r.id_relance = s.id_relance)
WHEN NOT MATCHED THEN
    INSERT (id_relance, niveau, canal, message, date_envoi, statut, jours_retard, id_impaye, id_contrat, id_utilisateur)
    VALUES (s.id_relance, s.niveau, s.canal, s.message, s.date_envoi, s.statut, s.jours_retard, s.id_impaye, s.id_contrat, s.id_utilisateur);

COMMIT;
PROMPT Données de test insérées avec succès.
