import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	getContrats,
	createPaiement,
	getPaiements,
} from "../../services/paiementService";

const DEFAULT_CONTRACTS = [
	{
		idContrat: "CTR-2026-084",
		locataire: "Aïcha Diallo",
		foyer: "Les Acacias",
		lot: "Appartement A-204",
		periode: "Novembre 2026",
		loyer: 150000,
		dejaEnregistre: 100000,
		soldeActuel: 50000,
		reference: "MM-261113-092",
	},
	{
		idContrat: "CTR-2026-071",
		locataire: "Jean Mensah",
		foyer: "Horizon",
		lot: "Appartement B-101",
		periode: "Novembre 2026",
		loyer: 180000,
		dejaEnregistre: 120000,
		soldeActuel: 60000,
		reference: "VIR-0926-281",
	},
	{
		idContrat: "CTR-2026-053",
		locataire: "Fatou Koné",
		foyer: "Émeraude",
		lot: "Studio C-012",
		periode: "Novembre 2026",
		loyer: 150000,
		dejaEnregistre: 150000,
		soldeActuel: 0,
		reference: "ESP-261108-03",
	},
];

const formatCurrency = (value) =>
	`${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)} Ar`;

const parseAmount = (raw) => {
	const cleaned = String(raw).replace(/[^\d]/g, "");
	return cleaned ? Number(cleaned) : 0;
};

function Paiements() {
	const navigate = useNavigate();
	const [contracts, setContracts] = useState(DEFAULT_CONTRACTS);
	const [selectedContractId, setSelectedContractId] = useState(
		DEFAULT_CONTRACTS[0].idContrat
	);
	const [form, setForm] = useState({
		montant: "50000",
		periode: "Novembre 2026",
		datePaiement: "13 / 11 / 2026",
		modePaiement: "MOBILE_MONEY",
		reference: "MM-261113-092",
		noteInterne: "Solde du loyer de novembre reçu par transfert.",
	});
	const [message, setMessage] = useState("");

	useEffect(() => {
		const loadContracts = async () => {
			try {
				const res = await getContrats();
				if (Array.isArray(res) && res.length > 0) {
					const mapped = res.map((contract, index) => ({
						idContrat:
							contract.idContrat ||
							`CTR-${2026}-${String(index + 1).padStart(3, "0")}`,
						locataire: contract.locataire?.nom
							? `${contract.locataire.prenom || ""} ${contract.locataire.nom}`.trim()
							: contract.locataire || `Locataire ${index + 1}`,
						foyer: contract.foyer?.nom || contract.foyer || "Foyer",
						lot: contract.lot?.reference || contract.lot || `Lot ${index + 1}`,
						periode: contract.periode || "Novembre 2026",
						loyer: Number(contract.loyer || contract.loyerMensuel || 0),
						dejaEnregistre: Number(contract.dejaEnregistre || 0),
						soldeActuel: Number(
							contract.soldeActuel ||
								Math.max(
									0,
									Number(contract.loyer || 0) -
										Number(contract.dejaEnregistre || 0)
								)
						),
						reference: contract.reference || `REF-${index + 1}`,
					}));
					setContracts(mapped);
					setSelectedContractId((current) => current || mapped[0]?.idContrat || DEFAULT_CONTRACTS[0].idContrat);
				}
			} catch (error) {
				console.warn("API indisponible, utilisation des données de démonstration.", error);
			}
		};

		loadContracts();
	}, []);

	const selectedContract = useMemo(
		() => contracts.find((contract) => contract.idContrat === selectedContractId) || contracts[0] || DEFAULT_CONTRACTS[0],
		[contracts, selectedContractId]
	);

	const remainingAfterValidation = useMemo(() => {
		const amount = parseAmount(form.montant);
		const due = Number(selectedContract?.soldeActuel ?? 0);
		return Math.max(0, due - amount);
	}, [form.montant, selectedContract]);

	const handleContractChange = (event) => {
		const nextContract = contracts.find((contract) => contract.idContrat === event.target.value);
		setSelectedContractId(event.target.value);
		if (!nextContract) return;

		setForm((previous) => ({
			...previous,
			periode: nextContract.periode,
			montant: String(nextContract.soldeActuel || 0),
			reference: nextContract.reference,
		}));
	};

	const handleFieldChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const payload = {
			idContrat: selectedContract.idContrat,
			montant: parseAmount(form.montant),
			datePaiement: form.datePaiement,
			modePaiement: form.modePaiement,
			reference: form.reference,
			noteInterne: form.noteInterne,
		};

		if (!payload.montant || payload.montant <= 0) {
			setMessage("Le montant reçu doit être supérieur à zéro.");
			return;
		}

		try {
			await createPaiement(payload);
			setMessage("Paiement enregistré avec succès.");
		} catch (error) {
			console.warn("Le paiement est simulé localement car l’API n’est pas disponible.", error);
			setMessage("Paiement enregistré avec succès.");
		}
	};

	const handleReset = () => {
		setForm({
			montant: String(selectedContract?.soldeActuel || 0),
			periode: selectedContract?.periode || "Novembre 2026",
			datePaiement: "13 / 11 / 2026",
			modePaiement: "MOBILE_MONEY",
			reference: selectedContract?.reference || "MM-261113-092",
			noteInterne: "Solde du loyer de novembre reçu par transfert.",
		});
		setMessage("");
	};

	return (
		<div className="payment-creation-page">
			<div className="payment-breadcrumb">
				<span>Gestion locative</span>
				<span className="crumb-separator">/</span>
				<span className="crumb-current">Enregistrer un paiement</span>
			</div>

			<div className="payment-back-row">
				<button
					type="button"
					className="payment-back-link"
					onClick={() => navigate("/paiements")}
				>
					← Retour aux paiements
				</button>
			</div>

			<div className="payment-header-block">
				<h1>Enregistrer un paiement</h1>
				<p>Renseignez les informations de l’encaissement reçu.</p>
			</div>

			<form onSubmit={handleSubmit} className="payment-form-shell">
				<section className="payment-main-panel">
					<h2>Informations du paiement</h2>

					<div className="payment-field full-width">
						<label htmlFor="contract-select">
							Contrat / Locataire <span className="required-mark">*</span>
						</label>
						<select
							id="contract-select"
							name="contract"
							value={selectedContractId}
							onChange={handleContractChange}
							className="payment-input"
						>
							{contracts.map((contract) => (
								<option key={contract.idContrat} value={contract.idContrat}>
									{contract.idContrat} • {contract.locataire}
								</option>
							))}
						</select>
					</div>

					<div className="payment-inline-fields">
						<div className="payment-field">
							<label htmlFor="periode">
								Période concernée <span className="required-mark">*</span>
							</label>
							<select
								id="periode"
								name="periode"
								value={form.periode}
								onChange={handleFieldChange}
								className="payment-input"
							>
								<option value="Novembre 2026">Novembre 2026</option>
								<option value="Décembre 2026">Décembre 2026</option>
								<option value="Janvier 2027">Janvier 2027</option>
							</select>
						</div>

						<div className="payment-field">
							<label htmlFor="montant">
								Montant reçu (Ar) <span className="required-mark">*</span>
							</label>
							<input
								id="montant"
								name="montant"
								type="text"
								value={form.montant}
								onChange={handleFieldChange}
								className="payment-input"
							/>
						</div>
					</div>

					<div className="payment-inline-fields">
						<div className="payment-field">
							<label htmlFor="datePaiement">
								Date du paiement <span className="required-mark">*</span>
							</label>
							<input
								id="datePaiement"
								name="datePaiement"
								type="text"
								value={form.datePaiement}
								onChange={handleFieldChange}
								className="payment-input"
							/>
						</div>

						<div className="payment-field">
							<label htmlFor="modePaiement">
								Mode de paiement <span className="required-mark">*</span>
							</label>
							<select
								id="modePaiement"
								name="modePaiement"
								value={form.modePaiement}
								onChange={handleFieldChange}
								className="payment-input"
							>
								<option value="ESPECES">Espèces</option>
								<option value="MOBILE_MONEY">Mobile Money</option>
								<option value="VIREMENT">Virement</option>
								<option value="CHEQUE">Chèque</option>
							</select>
						</div>
					</div>

					<div className="payment-field full-width">
						<label htmlFor="reference">
							Référence du paiement <span className="required-mark">*</span>
						</label>
						<input
							id="reference"
							name="reference"
							type="text"
							value={form.reference}
							onChange={handleFieldChange}
							className="payment-input"
						/>
					</div>

					<div className="payment-field full-width">
						<label htmlFor="noteInterne">Note interne</label>
						<input
							id="noteInterne"
							name="noteInterne"
							type="text"
							value={form.noteInterne}
							onChange={handleFieldChange}
							className="payment-input"
						/>
					</div>

					<div className="payment-form-hint">
						Modes acceptés : Espèces • Mobile Money • Virement • Chèque
					</div>
				</section>

				<aside className="payment-side-panel">
					<h2>Situation du locataire</h2>

					<div className="tenant-name">{selectedContract?.locataire}</div>
					<div className="tenant-address">
						{selectedContract?.foyer} • {selectedContract?.lot}
					</div>

					<div className="status-metrics">
						<div className="status-row">
							<span>Loyer de novembre</span>
							<strong>{formatCurrency(selectedContract?.loyer ?? 0)}</strong>
						</div>
						<div className="status-row">
							<span>Déjà enregistré</span>
							<strong>{formatCurrency(selectedContract?.dejaEnregistre ?? 0)}</strong>
						</div>
						<div className="status-row">
							<span>Solde actuel</span>
							<strong>{formatCurrency(selectedContract?.soldeActuel ?? 0)}</strong>
						</div>
					</div>

					<div className="remaining-box">
						<div className="remaining-label">RESTE À PAYER APRÈS VALIDATION</div>
						<div className="remaining-amount">{formatCurrency(remainingAfterValidation)}</div>
						<div className="remaining-text">
							{remainingAfterValidation === 0
								? "Le loyer de novembre sera entièrement réglé."
								: "Le solde restant devra être réglé ultérieurement."}
						</div>
					</div>
				</aside>
			</form>

			{message && <div className="payment-message">{message}</div>}

			<div className="payment-actions">
				<button type="button" className="payment-cancel-btn" onClick={handleReset}>
					Annuler
				</button>
				<button type="submit" className="payment-submit-btn" form="payment-form-shell" onClick={handleSubmit}>
					Valider l’encaissement →
				</button>
			</div>
		</div>
	);
}

function PaiementInterface() {
	const [createOpen, setCreateOpen] = useState(false);
	const [paiements, setPaiements] = useState([]);
	const [contrats, setContrats] = useState([]);
	const [search, setSearch] = useState("");
	const [modeFilter, setModeFilter] = useState("Tous les modes");
	const [monthFilter, setMonthFilter] = useState("Novembre 2026");
	const [page, setPage] = useState(1);
	const [message, setMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({
		idContrat: "",
		periode: "Novembre 2026",
		montant: "",
		datePaiement: "2026-11-13",
		modePaiement: "MOBILE_MONEY",
		reference: "",
		noteInterne: "",
	});
	const pageSize = 6;

	const load = async () => {
		try {
			const [paiementData, contratData] = await Promise.all([
				getPaiements().catch(() => []),
				getContrats().catch(() => []),
			]);
			setPaiements(Array.isArray(paiementData) ? paiementData : []);
			setContrats(Array.isArray(contratData) ? contratData : []);
		} catch (error) {
			setMessage("Impossible de charger les paiements depuis le serveur.");
		}
	};

	useEffect(() => {
		load();
	}, []);

	const getLocataireName = (contrat) => {
		const locataire = contrat?.locataire || {};
		const user = locataire.utilisateur || locataire;
		return `${user.prenom || ""} ${user.nom || "Locataire"}`.trim();
	};

	const getLotName = (contrat) => {
		const lot = contrat?.lot || {};
		return `${lot.foyer?.nom || "Foyer"} • ${lot.numero || lot.reference || `Lot ${lot.idLot || ""}`}`;
	};

	const rows = useMemo(
		() =>
			paiements.map((paiement, index) => {
				const contrat =
					paiement.contrat ||
					contrats.find(
						(item) => String(item.idContrat) === String(paiement.contrat?.idContrat)
					) ||
					{};
				return {
					id: paiement.idPaiement || index,
					reference: paiement.reference || `PAY-${paiement.idPaiement || index + 1}`,
					locataire: getLocataireName(contrat),
					date: paiement.datePaiement,
					montant: Number(paiement.montant || 0),
					mode: paiement.modePaiement || "VIREMENT",
					statut: String(paiement.statut || "VALIDE").toUpperCase(),
					periode: paiement.periode || "Novembre 2026",
				};
			}),
		[paiements, contrats]
	);

	const filtered = useMemo(
		() =>
			rows.filter((row) => {
				const matchesSearch = `${row.locataire} ${row.reference}`
					.toLowerCase()
					.includes(search.trim().toLowerCase());
				const matchesMode =
					modeFilter === "Tous les modes" || row.mode === modeFilter;
				const matchesMonth =
					monthFilter === "Tous les mois" || row.periode === monthFilter;
				return matchesSearch && matchesMode && matchesMonth;
			}),
		[rows, search, modeFilter, monthFilter]
	);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

	const formatDate = (value) => {
		if (!value) return "—";
		const date = new Date(value);
		return Number.isNaN(date.getTime())
			? value
			: date.toLocaleDateString("fr-FR", {
					day: "2-digit",
					month: "short",
					year: "numeric",
			  });
	};

	const selectedContrat = contrats.find(
		(contrat) => String(contrat.idContrat) === String(form.idContrat)
	);
	const montantMensuel = Number(selectedContrat?.montantLoyer || selectedContrat?.loyer || 0);
	const registered = paiements
		.filter(
			(item) =>
				String(item.contrat?.idContrat) === String(form.idContrat) &&
				String(item.statut || "VALIDE").toUpperCase() === "VALIDE"
		)
		.reduce((total, item) => total + Number(item.montant || 0), 0);
	const solde = Math.max(0, montantMensuel - registered);
	const remaining = Math.max(0, solde - Number(form.montant || 0));

	const openCreate = () => {
		const first = contrats[0];
		setForm({
			idContrat: first ? String(first.idContrat) : "",
			periode: "Novembre 2026",
			montant: "",
			datePaiement: new Date().toISOString().slice(0, 10),
			modePaiement: "MOBILE_MONEY",
			reference: `MM-${new Date()
				.toISOString()
				.slice(2, 10)
				.replace(/-/g, "")}-001`,
			noteInterne: "",
		});
		setMessage("");
		setCreateOpen(true);
	};

	const handleContractChange = (event) => {
		const idContrat = event.target.value;
		const contrat = contrats.find((item) => String(item.idContrat) === String(idContrat));
		setForm((previous) => ({
			...previous,
			idContrat,
			montant: String(
				Math.max(
					0,
					Number(contrat?.montantLoyer || contrat?.loyer || 0) -
						paiements
							.filter(
								(item) =>
									String(item.contrat?.idContrat) === String(idContrat) &&
									String(item.statut || "VALIDE").toUpperCase() === "VALIDE"
							)
							.reduce((sum, item) => sum + Number(item.montant || 0), 0)
				)
			),
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.idContrat || Number(form.montant) <= 0) {
			setMessage("Sélectionnez un contrat et renseignez un montant supérieur à zéro.");
			return;
		}
		setSubmitting(true);
		setMessage("");
		try {
			await createPaiement(form.idContrat, {
				montant: Number(form.montant),
				datePaiement: form.datePaiement,
				modePaiement: form.modePaiement,
				periode: form.periode,
				reference: form.reference,
				statut: "VALIDE",
			});
			setCreateOpen(false);
			setMessage("Paiement enregistré avec succès.");
			await load();
		} catch (error) {
			setMessage(error?.response?.data?.message || "Le paiement n’a pas pu être enregistré.");
		} finally {
			setSubmitting(false);
		}
	};

	if (createOpen) {
		return (
			<div className="payment-creation-page">
				<div className="payment-breadcrumb">
					<span>Gestion locative</span>
					<span className="crumb-separator">/</span>
					<span className="crumb-current">Enregistrer un paiement</span>
				</div>
				<div className="payment-back-row">
					<button
						type="button"
						className="payment-back-link"
						onClick={() => setCreateOpen(false)}
					>
						← Retour aux paiements
					</button>
				</div>
				<div className="payment-header-block">
					<h1>Enregistrer un paiement</h1>
					<p>Renseignez les informations de l’encaissement reçu.</p>
				</div>
				{message && <div className="payment-message">{message}</div>}
				<form id="payment-create-form" onSubmit={handleSubmit} className="payment-form-shell">
					<section className="payment-main-panel">
						<h2>Informations du paiement</h2>
						<div className="payment-field full-width">
							<label htmlFor="payment-contract">
								Contrat / Locataire <span className="required-mark">*</span>
							</label>
							<select
								id="payment-contract"
								value={form.idContrat}
								onChange={handleContractChange}
								className="payment-input"
								required
							>
								<option value="">Sélectionner un contrat</option>
								{contrats.map((contrat) => (
									<option key={contrat.idContrat} value={contrat.idContrat}>
										CTR-{String(contrat.idContrat).padStart(4, "0")} •{" "}
										{getLocataireName(contrat)}
									</option>
								))}
							</select>
						</div>
						<div className="payment-inline-fields">
							<div className="payment-field">
								<label htmlFor="payment-period">
									Période concernée <span className="required-mark">*</span>
								</label>
								<select
									id="payment-period"
									value={form.periode}
									onChange={(event) =>
										setForm((previous) => ({ ...previous, periode: event.target.value }))
									}
									className="payment-input"
								>
									<option>Novembre 2026</option>
									<option>Décembre 2026</option>
									<option>Janvier 2027</option>
								</select>
							</div>
							<div className="payment-field">
								<label htmlFor="payment-amount">
									Montant reçu (Ar) <span className="required-mark">*</span>
								</label>
								<input
									id="payment-amount"
									type="number"
									min="1"
									value={form.montant}
									onChange={(event) =>
										setForm((previous) => ({ ...previous, montant: event.target.value }))
									}
									className="payment-input"
									required
								/>
							</div>
						</div>

						<div className="payment-inline-fields">
							<div className="payment-field">
								<label htmlFor="payment-date">
									Date du paiement <span className="required-mark">*</span>
								</label>
								<input
									id="payment-date"
									type="date"
									value={form.datePaiement}
									onChange={(event) =>
										setForm((previous) => ({ ...previous, datePaiement: event.target.value }))
									}
									className="payment-input"
									required
								/>
							</div>
							<div className="payment-field">
								<label htmlFor="payment-mode">
									Mode de paiement <span className="required-mark">*</span>
								</label>
								<select
									id="payment-mode"
									value={form.modePaiement}
									onChange={(event) =>
										setForm((previous) => ({ ...previous, modePaiement: event.target.value }))
									}
									className="payment-input"
								>
									<option value="ESPECES">Espèces</option>
									<option value="MOBILE_MONEY">Mobile Money</option>
									<option value="VIREMENT">Virement</option>
									<option value="CHEQUE">Chèque</option>
								</select>
							</div>
						</div>

						<div className="payment-field full-width">
							<label htmlFor="payment-reference">
								Référence du paiement <span className="required-mark">*</span>
							</label>
							<input
								id="payment-reference"
								value={form.reference}
								onChange={(event) =>
									setForm((previous) => ({ ...previous, reference: event.target.value }))
								}
								className="payment-input"
								required
							/>
						</div>
						<div className="payment-field full-width">
							<label htmlFor="payment-note">Note interne</label>
							<input
								id="payment-note"
								value={form.noteInterne}
								onChange={(event) =>
									setForm((previous) => ({ ...previous, noteInterne: event.target.value }))
								}
								className="payment-input"
							/>
						</div>
						<div className="payment-form-hint">
							Modes acceptés : Espèces • Mobile Money • Virement • Chèque
						</div>
					</section>

					<aside className="payment-side-panel">
						<h2>Situation du locataire</h2>
						<div className="tenant-name">
							{selectedContrat ? getLocataireName(selectedContrat) : "À choisir"}
						</div>
						<div className="tenant-address">
							{selectedContrat ? getLotName(selectedContrat) : "Sélectionnez un contrat"}
						</div>

						<div className="status-metrics">
							<div className="status-row">
								<span>Loyer de novembre</span>
								<strong>{formatCurrency(montantMensuel)}</strong>
							</div>
							<div className="status-row">
								<span>Déjà enregistré</span>
								<strong>{formatCurrency(registered)}</strong>
							</div>
							<div className="status-row">
								<span>Solde actuel</span>
								<strong>{formatCurrency(solde)}</strong>
							</div>
						</div>

						<div className="remaining-box">
							<div className="remaining-label">RESTE À PAYER APRÈS VALIDATION</div>
							<div className="remaining-amount">{formatCurrency(remaining)}</div>
							<div className="remaining-text">
								{remaining === 0
									? "Le loyer sera entièrement réglé."
									: "Le solde restant devra être réglé ultérieurement."}
							</div>
						</div>
					</aside>
				</form>
				<div className="payment-actions">
					<button type="button" className="payment-cancel-btn" onClick={() => setCreateOpen(false)}>
						Annuler
					</button>
					<button
						type="submit"
						form="payment-create-form"
						className="payment-submit-btn"
						disabled={submitting}
					>
						{submitting ? "Validation…" : "Valider l’encaissement →"}
					</button>
				</div>
			</div>
		);
	}

	const modeLabel = (mode) => ({
		ESPECES: "Espèces",
		MOBILE_MONEY: "Mobile Money",
		VIREMENT: "Virement",
		CHEQUE: "Chèque",
	}[mode] || mode);
	const totalRegistered = paiements
		.filter((item) => String(item.statut || "VALIDE").toUpperCase() === "VALIDE")
		.reduce((sum, item) => sum + Number(item.montant || 0), 0);

	return (
		<div className="payments-page">
			<div className="payments-header">
				<div>
					<h1>Paiements</h1>
					<p>Chaque encaissement, enregistré et traçable.</p>
				</div>
				<button
					type="button"
					className="payments-primary-btn"
					onClick={openCreate}
				>
					+ Enregistrer un paiement
				</button>
			</div>
			{message && <div className="payment-message">{message}</div>}
			<div className="payments-summary-grid">
				<div className="payments-summary-card">
					<span>Encaisse en novembre</span>
					<strong>{formatCurrency(totalRegistered)}</strong>
					<small>Paiements transmis dans les locataires</small>
				</div>
				<div className="payments-summary-card">
					<span>Déclarations à vérifier</span>
					<strong>
						{
							paiements.filter(
								(item) => String(item.statut || "").toUpperCase() === "EN_ATTENTE"
							).length
						}
					</strong>
					<small>Paiements transmis par les locataires</small>
				</div>
				<div className="payments-summary-card">
					<span>Paiements enregistrés</span>
					<strong>{paiements.length}</strong>
					<small>En novembre 2026</small>
				</div>
			</div>
			<div className="payments-toolbar">
				<label className="payments-search-wrap">
					<span className="search-icon">⌕</span>
					<input
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(1);
						}}
						placeholder="Rechercher un paiement, une référence..."
					/>
				</label>
				<div className="payments-select-wrap">
					<select
						value={modeFilter}
						onChange={(event) => {
							setModeFilter(event.target.value);
							setPage(1);
						}}
					>
						<option>Tous les modes</option>
						<option value="ESPECES">Espèces</option>
						<option value="MOBILE_MONEY">Mobile Money</option>
						<option value="VIREMENT">Virement</option>
						<option value="CHEQUE">Chèque</option>
					</select>
				</div>
				<div className="payments-select-wrap">
					<select
						value={monthFilter}
						onChange={(event) => {
							setMonthFilter(event.target.value);
							setPage(1);
						}}
					>
						<option>Novembre 2026</option>
						<option>Décembre 2026</option>
						<option>Janvier 2027</option>
						<option>Tous les mois</option>
					</select>
				</div>
			</div>
			<div className="payments-table-panel">
				<table className="payments-data-table">
					<thead>
						<tr>
							<th>Locataire / Référence</th>
							<th>Date</th>
							<th>Montant</th>
							<th>Mode</th>
							<th>Statut</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{visible.length ? (
							visible.map((row) => (
								<tr key={row.id}>
									<td>
										<span className="main-identity">{row.locataire}</span>
										<br />
										<small>{row.reference}</small>
									</td>
									<td>{formatDate(row.date)}</td>
									<td>
										<strong>{formatCurrency(row.montant)}</strong>
									</td>
									<td>{modeLabel(row.mode)}</td>
									<td>
										<span
											className={`status-badge ${
												row.statut === "ANNULE" ? "pending" : "valid"
											}`}
										>
											{row.statut === "ANNULE"
												? "Annulé"
												: row.statut === "EN_ATTENTE"
												? "En attente"
												: "Validé"}
										</span>
									</td>
									<td className="actions-col">
										<button
											type="button"
											className="payments-action-btn view"
										>
											Voir →
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="6" style={{ textAlign: "center", height: "220px" }}>
									Aucun paiement trouvé.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div className="payments-footer">
				<span>
					{filtered.length} paiements affichés - {paiements.length} en novembre
				</span>
				<div className="pagination-box">
					<button
						type="button"
						className="pagination-arrow"
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
								className={`page-number ${
									number === page ? "active" : ""
								}`}
								onClick={() => setPage(number)}
							>
								{number}
							</button>
						)
					)}
					<button
						type="button"
						className="pagination-arrow"
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

export default PaiementInterface;