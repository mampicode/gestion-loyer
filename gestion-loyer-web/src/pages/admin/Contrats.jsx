import { useEffect, useMemo, useState } from "react";
import { createContrat, getContrats } from "../../services/contratService";
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
	const [contrats, setContrats] = useState([]);
	const [locataires, setLocataires] = useState([]);
	const [lots, setLots] = useState([]);
	const [createOpen, setCreateOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("Tous les statuts");
	const [foyerFilter, setFoyerFilter] = useState("Tous les foyers");
	const [page, setPage] = useState(1);
	const [message, setMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const pageSize = 6;

	const load = async () => {
		const [contratData, locataireData, lotData] = await Promise.all([
			getContrats().catch(() => []),
			getLocataires().catch(() => []),
			getLots().catch(() => []),
		]);
		setContrats(Array.isArray(contratData) ? contratData : []);
		setLocataires(Array.isArray(locataireData) ? locataireData : []);
		setLots(Array.isArray(lotData) ? lotData : []);
	};

	useEffect(() => {
		load();
	}, []);

	const getLocataireName = (contrat) => {
		const locataire = contrat?.locataire || {};
		const user = locataire.utilisateur || locataire;
		return `${user.prenom || ""} ${user.nom || "Locataire"}`.trim();
	};

	const getLot = (contrat) => contrat?.lot || {};

	const filtered = useMemo(
		() =>
			contrats.filter((contrat) => {
				const lot = getLot(contrat);
				const haystack = `${contrat.idContrat || ""} ${getLocataireName(
					contrat
				)} ${lot.numero || ""} ${lot.foyer?.nom || ""}`.toLowerCase();
				const matchesSearch = haystack.includes(search.trim().toLowerCase());
				const statut = String(contrat.statut || "EN_COURS").toUpperCase();
				const matchesStatus =
					statusFilter === "Tous les statuts" || statut === statusFilter;
				const matchesFoyer =
					foyerFilter === "Tous les foyers" ||
					lot.foyer?.nom === foyerFilter;
				return matchesSearch && matchesStatus && matchesFoyer;
			}),
		[contrats, search, statusFilter, foyerFilter]
	);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

	useEffect(() => {
		if (page > totalPages) setPage(totalPages);
	}, [page, totalPages]);

	const foyerNames = useMemo(
		() =>
			[
				...new Set(
					lots.map((lot) => lot.foyer?.nom).filter(Boolean)
				),
			].sort(),
		[lots]
	);
	const availableLots = lots.filter(
		(lot) => String(lot.statut || "LIBRE").toUpperCase() === "LIBRE"
	);

	const selectedLocataire = locataires.find((item) => {
		const id = item.idUtilisateur || item.id || item.utilisateur?.idUtilisateur;
		return String(id) === String(form.idLocataire);
	});
	const selectedLot = availableLots.find(
		(lot) => String(lot.idLot) === String(form.idLot)
	);

	const openCreate = () => {
		setForm(emptyForm);
		setMessage("");
		setCreateOpen(true);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.idLocataire || !form.idLot || !form.dateDebut || !form.montantLoyer) {
			setMessage("Sélectionnez un locataire, un lot disponible et renseignez les informations obligatoires.");
			return;
		}
		setSubmitting(true);
		setMessage("");
		const payload = {
			dateDebut: form.dateDebut,
			dateFin: form.dateFin || null,
			montantLoyer: Number(form.montantLoyer),
			caution: 0,
			duree: 12,
			renouvellementAutomatique: form.renouvellementAutomatique,
			statut: form.statut,
		};
		try {
			await createContrat(form.idLocataire, form.idLot, payload);
			setMessage("Contrat créé avec succès.");
			setCreateOpen(false);
			setForm(emptyForm);
			setSearch("");
			setStatusFilter("Tous les statuts");
			setFoyerFilter("Tous les foyers");
			setPage(1);
			await load();
		} catch (error) {
			setMessage(error?.response?.data?.message || "Le contrat n’a pas pu être créé. Vérifiez la disponibilité du lot.");
		} finally {
			setSubmitting(false);
		}
	};

	const formatDate = (value) => {
		if (!value) return "—";
		const date = new Date(value);
		return Number.isNaN(date.getTime())
			? value
			: date.toLocaleDateString("fr-FR", {
					day: "numeric",
					month: "short",
					year: "numeric",
			  });
	};

	const formatMoney = (value) => `${Number(value || 0).toLocaleString("fr-FR")} Ar`;

	if (createOpen) {
		const locataireName = selectedLocataire
			? `${selectedLocataire.utilisateur?.prenom || selectedLocataire.prenom || ""} ${selectedLocataire.utilisateur?.nom || selectedLocataire.nom || "Locataire"}`.trim()
			: "À choisir";

		return (
			<div className="contract-form-page">
				<div className="contract-form-breadcrumb">
					<span>Gestion locative</span>
					<span className="contract-breadcrumb-separator">/</span>
					<span className="contract-current-page">Nouveau contrat</span>
				</div>
				<button
					type="button"
					className="contract-back-link"
					onClick={() => setCreateOpen(false)}
				>
					← Retour aux contrats
				</button>
				<div className="contract-form-header">
					<h1>Nouveau contrat de location</h1>
					<p>
						Associez un locataire à un lot disponible et définissez ses échéances.
					</p>
				</div>
				{message && (
					<div className="contract-create-message" role="status">
						{message}
					</div>
				)}
				<form id="contract-create-form" onSubmit={handleSubmit} className="contract-form-layout">
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
									required
								>
									<option value="">Sélectionner un locataire</option>
									{locataires.map((locataire) => {
										const id =
											locataire.idUtilisateur ||
											locataire.id ||
											locataire.utilisateur?.idUtilisateur;
										const user = locataire.utilisateur || locataire;
										return (
											<option key={id} value={id}>
												{`${user.prenom || ""} ${user.nom || "Locataire"}`.trim()}
											</option>
										);
									})}
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
										onChange={(event) => {
											handleChange(event);
											const lot = availableLots.find(
												(item) => String(item.idLot) === event.target.value
											);
											if (lot?.loyerBase)
												setForm((previous) => ({
													...previous,
													montantLoyer: String(lot.loyerBase),
													idLot: event.target.value,
												}));
										}}
										className="contract-input"
										required
									>
										<option value="">Sélectionner un lot</option>
										{availableLots.map((lot) => (
											<option key={lot.idLot} value={lot.idLot}>
												{lot.numero || `Lot ${lot.idLot}`} •{" "}
												{lot.foyer?.nom || lot.typeLot || "Appartement"}
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
										type="number"
										min="1"
										value={form.montantLoyer}
										onChange={handleChange}
										className="contract-input"
										required
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
										required
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
						<div className="contract-form-footer-note">* Champs obligatoires</div>
					</section>

					<aside className="contract-summary-panel">
						<h3>Récapitulatif</h3>
						<div className="summary-row">
							<span>Locataire</span>
							<strong>{locataireName}</strong>
						</div>
						<div className="summary-row">
							<span>Logement</span>
							<strong>
								{selectedLot
									? `${selectedLot.foyer?.nom || "Foyer"} • ${selectedLot.numero || `Lot ${selectedLot.idLot}`}`
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
					<button
						type="button"
						className="contract-cancel-btn"
						onClick={() => setCreateOpen(false)}
					>
						Annuler
					</button>
					<button
						type="submit"
						form="contract-create-form"
						className="contract-submit-btn"
						disabled={submitting}
					>
						{submitting ? "Création…" : "Créer le contrat →"}
					</button>
				</div>
			</div>
		);
	}

	const activeCount = contrats.filter(
		(item) => String(item.statut || "EN_COURS").toUpperCase() === "EN_COURS"
	).length;
	const renewalCount = contrats.filter(
		(item) => item.renouvellementAutomatique === "O"
	).length;
	const resolvedCount = contrats.filter(
		(item) =>
			["RESILIE", "TERMINE", "EXPIRE"].includes(
				String(item.statut || "").toUpperCase()
			)
	).length;

	return (
		<div className="contracts-page">
			<div className="contracts-header">
				<div>
					<h1>Contrats de location</h1>
					<p>Le contrat, le bail, les échéances maîtrisées.</p>
				</div>
				<button
					type="button"
					className="contracts-primary"
					onClick={openCreate}
				>
					+ Nouveau contrat
				</button>
			</div>
			{message && (
				<div className="contracts-notice" role="status">
					{message}
				</div>
			)}
			<div className="contracts-metrics">
				<div className="contracts-metric">
					<span>Contrats actifs</span>
					<strong>{activeCount}</strong>
					<small>Sur l’ensemble du parc</small>
				</div>
				<div className="contracts-metric">
					<span>Renouvellements</span>
					<strong>{renewalCount}</strong>
					<small>À prévoir ce mois</small>
				</div>
				<div className="contracts-metric">
					<span>Contrats résiliés</span>
					<strong>{resolvedCount}</strong>
					<small>Sur l’année 2026</small>
				</div>
			</div>
			<div className="contracts-toolbar">
				<label className="contracts-search">
					<span>⌕</span>
					<input
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(1);
						}}
						placeholder="Rechercher un locataire, un contrat..."
					/>
				</label>
				<select
					value={statusFilter}
					onChange={(event) => {
						setStatusFilter(event.target.value);
						setPage(1);
					}}
				>
					<option>Tous les statuts</option>
					<option value="EN_COURS">Actif</option>
					<option value="A_VENIR">À venir</option>
					<option value="RESILIE">Résilié</option>
				</select>
				<select
					value={foyerFilter}
					onChange={(event) => {
						setFoyerFilter(event.target.value);
						setPage(1);
					}}
				>
					<option>Tous les foyers</option>
					{foyerNames.map((name) => (
						<option key={name}>{name}</option>
					))}
				</select>
			</div>
			<div className="contracts-table-card">
				<table className="contracts-table">
					<thead>
						<tr>
							<th>Contrat / Locataire</th>
							<th>Foyer / Lot</th>
							<th>Loyer mensuel</th>
							<th>Échéance</th>
							<th>Statut</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{visible.length ? (
							visible.map((contrat) => {
								const lot = getLot(contrat);
								const statut = String(contrat.statut || "EN_COURS").toUpperCase();
								const label =
									statut === "RESILIE"
										? "Résilié"
										: statut === "A_VENIR"
										? "À venir"
										: "Actif";
								return (
									<tr key={contrat.idContrat}>
										<td>
											<strong>
												CTR-{String(contrat.idContrat || "").padStart(3, "0")}
											</strong>
											<span className="contracts-cell-sub">
												{" "}
												/ {getLocataireName(contrat)}
											</span>
										</td>
										<td>
											<strong>{lot.foyer?.nom || "—"}</strong>
											<span className="contracts-cell-sub">
												{" "}
												/ {lot.numero || `Lot ${lot.idLot || "—"}`}
											</span>
										</td>
										<td>
											<strong>{formatMoney(contrat.montantLoyer)}</strong>
										</td>
										<td>{formatDate(contrat.dateFin)}</td>
										<td>
											<span
												className={`contracts-status ${
													statut === "RESILIE"
														? "terminated"
														: statut === "A_VENIR"
														? "upcoming"
														: "active"
												}`}
											>
												{label}
											</span>
										</td>
										<td>
											<button type="button" className="contracts-view">
												Voir <span>→</span>
											</button>
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan="6" className="contracts-empty">
									Aucun contrat trouvé.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div className="contracts-footer">
				<span>
					{filtered.length} contrats affichés - {contrats.length} au total
				</span>
				<div className="contracts-pagination">
					<button
						type="button"
						disabled={page === 1}
						onClick={() => setPage((value) => Math.max(1, value - 1))}
					>
						‹
					</button>
					{Array.from({ length: totalPages }, (_, index) => index + 1).map(
						(number) => (
							<button
								type="button"
								key={number}
								className={number === page ? "active" : ""}
								onClick={() => setPage(number)}
							>
								{number}
							</button>
						)
					)}
					<button
						type="button"
						disabled={page === totalPages}
						onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
					>
						›
					</button>
				</div>
			</div>
		</div>
	);
}

export default Contrats;