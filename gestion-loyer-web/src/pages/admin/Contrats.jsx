import { useEffect, useMemo, useState } from "react";
import { getContrats } from "../../services/contratService";
import { getLots } from "../../services/lotService";
import { getLocataires } from "../../services/locataireService";

const emptyForm = {
	idLocataire: "",
	idLot: "",
	montantLoyer: "85000",
	dateDebut: "2026-12-01",
	dateFin: "2027-11-30",
	statut: "EN_COURS",
	renouvellementAutomatique: "N",
};

function Contrats() {
	const [form, setForm] = useState(emptyForm);
	const [locataires, setLocataires] = useState([]);
	const [lots, setLots] = useState([]);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const load = async () => {
			try {
				const [locatairesRes, lotsRes] = await Promise.all([
					getLocataires().catch(() => []),
					getLots().catch(() => []),
				]);
				setLocataires(locatairesRes || []);
				setLots(
					(lotsRes || []).filter(
						(lot) =>
							String(lot.statut || "").toUpperCase() !== "INACTIF"
					)
				);
			} catch (error) {
				console.warn("Contrats: données indisponibles", error);
			}
		};
		load();
	}, []);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.idLocataire || !form.idLot) {
			setMessage("Sélectionnez un locataire et un lot disponible.");
			return;
		}

		const payload = {
			dateDebut: form.dateDebut,
			dateFin: form.dateFin,
			montantLoyer: Number(form.montantLoyer),
			caution: 0,
			duree: 12,
			renouvellementAutomatique: form.renouvellementAutomatique,
			statut: form.statut,
		};

		try {
			const res = await fetch(
				`http://localhost:8080/api/contrats/locataire/${form.idLocataire}/lot/${form.idLot}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);
			if (!res.ok) throw new Error("Erreur API");
			setMessage("Contrat créé avec succès.");
			setForm(emptyForm);
		} catch (error) {
			setMessage(
				"Le contrat a été préparé localement ; l’API backend est indisponible."
			);
		}
	};

	const selectedLot = useMemo(
		() => lots.find((lot) => String(lot.idLot) === String(form.idLot)) || null,
		[lots, form.idLot]
	);

	return (
		<div className="contract-form-page">
			<div className="contract-form-breadcrumb">
				<span>Gestion locative</span>
				<span className="contract-breadcrumb-separator">/</span>
				<span className="contract-current-page">Nouveau contrat</span>
			</div>

			<div className="contract-form-back-row">
				<button type="button" className="contract-back-link">
					← Retour aux contrats
				</button>
			</div>

			<div className="contract-form-header">
				<h1>Nouveau contrat de location</h1>
				<p>
					Associez un locataire à un lot disponible et définissez ses échéances.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="contract-form-layout">
				<section className="contract-form-panel">
					<div className="contract-form-section">
						<h2>01 Locataire et logement</h2>

						<div className="contract-field full-width">
							<label htmlFor="idLocataire">
								Locataire <span className="required">*</span>
							</label>
							<select
								id="idLocataire"
								name="idLocataire"
								value={form.idLocataire}
								onChange={handleChange}
								className="contract-input"
							>
								<option value="">Sélectionner un locataire</option>
								{locataires.map((locataire) => (
									<option
										key={
											locataire.idUtilisateur ||
											locataire.id ||
											locataire.utilisateur?.idUtilisateur
										}
										value={
											locataire.idUtilisateur ||
											locataire.id ||
											locataire.utilisateur?.idUtilisateur
										}
									>
										{locataire.utilisateur
											? `${locataire.utilisateur.prenom} ${locataire.utilisateur.nom}`
											: locataire.nom || locataire.prenom || "Locataire"}
									</option>
								))}
							</select>
						</div>

						<div className="contract-inline-fields">
							<div className="contract-field">
								<label htmlFor="idLot">
									Lot disponible <span className="required">*</span>
								</label>
								<select
									id="idLot"
									name="idLot"
									value={form.idLot}
									onChange={handleChange}
									className="contract-input"
								>
									<option value="">Sélectionner un lot</option>
									{lots.map((lot) => (
										<option key={lot.idLot} value={lot.idLot}>
											{lot.numero || lot.reference || `LOT-${lot.idLot}`} •{" "}
											{lot.typeLot || "Appartement"}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					<div className="contract-form-section second-section">
						<h2>02 Conditions du contrat</h2>

						<div className="contract-inline-fields">
							<div className="contract-field">
								<label htmlFor="montantLoyer">
									Loyer mensuel (Ar) <span className="required">*</span>
								</label>
								<input
									id="montantLoyer"
									name="montantLoyer"
									value={form.montantLoyer}
									onChange={handleChange}
									className="contract-input"
									placeholder="85000"
								/>
							</div>

							<div className="contract-field">
								<label htmlFor="statut">
									Statut du contrat <span className="required">*</span>
								</label>
								<select
									id="statut"
									name="statut"
									value={form.statut}
									onChange={handleChange}
									className="contract-input"
								>
									<option value="EN_COURS">Actif</option>
									<option value="A_VENIR">À venir</option>
									<option value="RESILIE">Résilié</option>
								</select>
							</div>
						</div>

						<div className="contract-inline-fields">
							<div className="contract-field">
								<label htmlFor="dateDebut">
									Date de début <span className="required">*</span>
								</label>
								<input
									id="dateDebut"
									name="dateDebut"
									type="date"
									value={form.dateDebut}
									onChange={handleChange}
									className="contract-input"
								/>
							</div>

							<div className="contract-field">
								<label htmlFor="dateFin">Date de fin</label>
								<input
									id="dateFin"
									name="dateFin"
									type="date"
									value={form.dateFin}
									onChange={handleChange}
									className="contract-input"
								/>
							</div>
						</div>

						<div className="contract-inline-fields final-row">
							<div className="contract-field">
								<label htmlFor="renouvellementAutomatique">
									Renouvellement automatique
								</label>
								<select
									id="renouvellementAutomatique"
									name="renouvellementAutomatique"
									value={form.renouvellementAutomatique}
									onChange={handleChange}
									className="contract-input"
								>
									<option value="N">Non</option>
									<option value="O">Oui</option>
								</select>
							</div>

							<div className="contract-field info-hint-field">
								<span className="contract-hint-text">
									Le contrat sera actif à sa date de début.
								</span>
							</div>
						</div>
					</div>

					{message && <div className="alert success">{message}</div>}
					<div className="contract-form-footer-note">* Champs obligatoires</div>
				</section>

				<aside className="contract-summary-panel">
					<h3>Récapitulatif</h3>

					<div className="summary-row">
						<span>Locataire</span>
						<strong>
							{locataires.find(
								(locataire) =>
									String(
										locataire.idUtilisateur ||
											locataire.id ||
											locataire.utilisateur?.idUtilisateur
									) === String(form.idLocataire)
							)
								? locataires.find(
										(locataire) =>
											String(
												locataire.idUtilisateur ||
													locataire.id ||
													locataire.utilisateur?.idUtilisateur
											) === String(form.idLocataire)
								  ).utilisateur
									? `${locataires.find(
											(locataire) =>
												String(
													locataire.idUtilisateur ||
														locataire.id ||
														locataire.utilisateur?.idUtilisateur
												) === String(form.idLocataire)
									  ).utilisateur.prenom} ${locataires.find(
											(locataire) =>
												String(
													locataire.idUtilisateur ||
														locataire.id ||
														locataire.utilisateur?.idUtilisateur
												) === String(form.idLocataire)
									  ).utilisateur.nom}`
									: "Locataire"
								: "À choisir"}
						</strong>
					</div>

					<div className="summary-row">
						<span>Logement</span>
						<strong>
							{selectedLot
								? selectedLot.numero ||
								  selectedLot.reference ||
								  `LOT-${selectedLot.idLot}`
								: "À choisir"}
						</strong>
					</div>

					<div className="summary-row">
						<span>Période</span>
						<strong>
							{form.dateDebut || "-"} - {form.dateFin || "-"}
						</strong>
					</div>

					<div className="summary-price-box">
						<div className="summary-price-label">LOYER MENSUEL</div>
						<div className="summary-price-value">
							{Number(form.montantLoyer || 0).toLocaleString("fr-FR")} Ar
						</div>
						<div className="summary-price-sub">
							À régler selon l’échéance du contrat
						</div>
					</div>
				</aside>
			</form>

			<div className="contract-action-row">
				<button type="button" className="contract-cancel-btn">
					Annuler
				</button>
				<button
					type="submit"
					className="contract-submit-btn"
					onClick={handleSubmit}
				>
					Créer le contrat →
				</button>
			</div>
		</div>
	);
}

export default Contrats;