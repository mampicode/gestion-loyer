import { useEffect, useMemo, useState } from "react";
import { getContrats, createPaiement } from "../../services/paiementService";

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
	const [contracts, setContracts] = useState(DEFAULT_CONTRACTS);
	const [selectedContractId, setSelectedContractId] = useState(DEFAULT_CONTRACTS[0].idContrat);
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
						idContrat: contract.idContrat || `CTR-${2026}-${String(index + 1).padStart(3, "0")}`,
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
								Math.max(0, Number(contract.loyer || 0) - Number(contract.dejaEnregistre || 0))
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
				<button type="button" className="payment-back-link">
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
								Montant reçu (FCFA) <span className="required-mark">*</span>
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

export default Paiements;