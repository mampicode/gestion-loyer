import { useMemo, useState } from "react";

const initialRows = [
	{
		id: 1,
		locataire: "Aïcha Diallo",
		foyer: "Les Acacias",
		lot: "A-204",
		montant: 50000,
		echeance: "05 nov. 2026",
		retard: 8,
		statut: "EN_ATTENTE",
		relance: false,
	},
	{
		id: 2,
		locataire: "Moussa Touré",
		foyer: "Horizon",
		lot: "B-201",
		montant: 180000,
		echeance: "05 nov. 2026",
		retard: 8,
		statut: "EN_ATTENTE",
		relance: false,
	},
	{
		id: 3,
		locataire: "Nadia Coulibaly",
		foyer: "Émeraude",
		lot: "C-203",
		montant: 120000,
		echeance: "10 nov. 2026",
		retard: 3,
		statut: "EN_ATTENTE",
		relance: false,
	},
	{
		id: 4,
		locataire: "Serge N'Guessan",
		foyer: "Les Palmier",
		lot: "V-02",
		montant: 250000,
		echeance: "01 oct. 2026",
		retard: 43,
		statut: "RELANCE",
		relance: true,
	},
	{
		id: 5,
		locataire: "Koffi Yao",
		foyer: "Horizon",
		lot: "B-304",
		montant: 90000,
		echeance: "05 nov. 2026",
		retard: 8,
		statut: "EN_ATTENTE",
		relance: false,
	},
	{
		id: 6,
		locataire: "Aminata Soro",
		foyer: "Les Acacias",
		lot: "A-302",
		montant: 200000,
		echeance: "01 nov. 2026",
		retard: 12,
		statut: "EN_ATTENTE",
		relance: false,
	},
	{
		id: 7,
		locataire: "Eric Kouassi",
		foyer: "Émeraude",
		lot: "C-201",
		montant: 150000,
		echeance: "05 nov. 2026",
		retard: 8,
		statut: "EN_ATTENTE",
		relance: false,
	},
	{
		id: 8,
		locataire: "Rose Aké",
		foyer: "Horizon",
		lot: "B-401",
		montant: 200000,
		echeance: "01 nov. 2026",
		retard: 12,
		statut: "EN_ATTENTE",
		relance: false,
	},
];

const formatCurrency = (value) =>
	`${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)} Ar`;

function Impayes() {
	const [rows, setRows] = useState(initialRows);
	const [search, setSearch] = useState("");
	const [retardFilter, setRetardFilter] = useState("Tous les retards");
	const [foyerFilter, setFoyerFilter] = useState("Tous les foyers");

	const filteredRows = useMemo(() => {
		return rows.filter((row) => {
			const matchesSearch = `${row.locataire} ${row.foyer} ${row.lot}`
				.toLowerCase()
				.includes(search.toLowerCase());

			const matchesRetard =
				retardFilter === "Tous les retards" ||
				(retardFilter === "0 à 7 jours" && row.retard <= 7) ||
				(retardFilter === "8 à 15 jours" && row.retard >= 8 && row.retard <= 15) ||
				(retardFilter === "> 15 jours" && row.retard > 15);

			const matchesFoyer = foyerFilter === "Tous les foyers" || row.foyer === foyerFilter;

			return matchesSearch && matchesRetard && matchesFoyer;
		});
	}, [rows, search, retardFilter, foyerFilter]);

	const totalDu = rows.reduce((sum, row) => sum + row.montant, 0);
	const locatairesConcerne = rows.length;
	const retardMax = Math.max(...rows.map((row) => row.retard));

	const handleRelancer = (id) => {
		setRows((currentRows) =>
			currentRows.map((row) =>
				row.id === id
					? {
							...row,
							relance: true,
							statut: "RELANCE",
					  }
					: row
			)
		);
	};

	const exportCsv = () => {
		const headers = ["Locataire", "Foyer", "Lot", "Montant dû", "Échéance", "Retard"];
		const csvRows = filteredRows.map((row) => [
			row.locataire,
			row.foyer,
			row.lot,
			row.montant,
			row.echeance,
			`${row.retard} j de retard`,
		]);

		const csvContent = [headers, ...csvRows]
			.map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "impayes.csv";
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="impayes-page">
			<div className="impayes-header">
				<div>
					<h1>Suivi des impayés</h1>
					<p>Identifiez les retards et priorisez vos relances.</p>
				</div>

				<button type="button" className="export-btn" onClick={exportCsv}>
					↗ Exporter la liste
				</button>
			</div>

			<div className="impayes-summary-grid">
				<div className="impaye-summary-card">
					<span>Total des sommes dues</span>
					<strong>{formatCurrency(totalDu)}</strong>
					<small>Au 13 novembre 2026</small>
				</div>

				<div className="impaye-summary-card">
					<span>Locataires concernés</span>
					<strong>{locatairesConcerne}</strong>
					<small>{locatairesConcerne} contrats avec solde restant</small>
				</div>

				<div className="impaye-summary-card">
					<span>Retard le plus ancien</span>
					<strong>{retardMax} jours</strong>
					<small>Échéance du 1er octobre 2026</small>
				</div>
			</div>

			<div className="impayes-toolbar">
				<div className="impayes-search-wrap">
					<span className="search-icon">⌕</span>
					<input
						type="text"
						value={search}
						placeholder="Rechercher un locataire..."
						onChange={(event) => setSearch(event.target.value)}
					/>
				</div>

				<div className="impayes-select-wrap">
					<select value={retardFilter} onChange={(event) => setRetardFilter(event.target.value)}>
						<option>Tous les retards</option>
						<option>0 à 7 jours</option>
						<option>8 à 15 jours</option>
						<option>&gt; 15 jours</option>
					</select>
				</div>

				<div className="impayes-select-wrap">
					<select value={foyerFilter} onChange={(event) => setFoyerFilter(event.target.value)}>
						<option>Tous les foyers</option>
						<option>Les Acacias</option>
						<option>Horizon</option>
						<option>Émeraude</option>
						<option>Les Palmier</option>
					</select>
				</div>
			</div>

			<div className="impayes-table-panel">
				<table className="impayes-table">
					<thead>
						<tr>
							<th>Locataire</th>
							<th>Foyer / Lot</th>
							<th>Montant dû</th>
							<th>Échéance</th>
							<th>Retard</th>
							<th className="actions-header"> </th>
						</tr>
					</thead>
					<tbody>
						{filteredRows.map((row) => (
							<tr key={row.id}>
								<td>{row.locataire}</td>
								<td>
									<span className="foyer-cell">{row.foyer}</span>
									<span className="lot-cell"> • {row.lot}</span>
								</td>
								<td>{formatCurrency(row.montant)}</td>
								<td>{row.echeance}</td>
								<td>
									<span className={`retard-pill ${row.retard > 15 ? "high" : "normal"}`}>
										{row.retard} de retard
									</span>
								</td>
								<td className="actions-cell">
									<button
										type="button"
										className={`relance-btn ${row.relance ? "sent" : ""}`}
										onClick={() => handleRelancer(row.id)}
										disabled={row.relance}
									>
										{row.relance ? "Relancé" : "Relancer"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="impayes-footer">
				<span>
					{filteredRows.length} dossiers • Total :{" "}
					{formatCurrency(filteredRows.reduce((sum, row) => sum + row.montant, 0))}
				</span>
			</div>
		</div>
	);
}

export default Impayes;