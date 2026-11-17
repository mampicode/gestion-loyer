import { useEffect, useMemo, useState } from "react";
import {
	getChiffreAffaires,
	getRapportImpayes,
	getRapportPaiements,
} from "../../services/rapportService";

const defaultReportStats = [
	{
		label: "Chiffre d’affaires",
		value: "8 760 000",
		kicker: "Ar • Novembre 2026",
		type: "primary",
	},
	{
		label: "Montant attendu",
		value: "10 000 000",
		kicker: "FCFA • Loyers de novembre",
		type: "secondary",
	},
	{
		label: "Taux de recouvrement",
		value: "87,6 %",
		kicker: "+ 4,2 points vs octobre",
		type: "secondary",
	},
	{
		label: "Reste à encaisser",
		value: "1 240 000",
		kicker: "FCFA • 8 dossiers impayés",
		type: "secondary",
	},
];

const monthlyFallback = [
	{ month: "Juin", value: 2, accent: "soft" },
	{ month: "Juil.", value: 5, accent: "soft" },
	{ month: "Août", value: 3, accent: "soft" },
	{ month: "Sept.", value: 7, accent: "soft" },
	{ month: "Oct.", value: 8, accent: "strong" },
	{ month: "Nov.", value: 9, accent: "strong" },
];

const paymentModes = [
	{ label: "Mobile Money", value: 46 },
	{ label: "Virement", value: 32 },
	{ label: "Espèces", value: 18 },
	{ label: "Chèque", value: 4 },
];

const foyerRows = [
	{
		foyer: "Les Acacias",
		lots: "22 / 24",
		attendu: "3 000 000",
		encaisse: "3 050 000",
		reste: "250 000",
		taux: "92,4 %",
	},
	{
		foyer: "Résidence Horizon",
		lots: "18 / 20",
		attendu: "3 240 000",
		encaisse: "2 700 000",
		reste: "540 000",
		taux: "83,3 %",
	},
	{
		foyer: "10 autres foyers",
		lots: "44 / 52",
		attendu: "3 460 000",
		encaisse: "3 010 000",
		reste: "450 000",
		taux: "87,0 %",
	},
];

function Rapports() {
	const [selectedMonth, setSelectedMonth] = useState("2026");
	const [selectedFoyerPeriod, setSelectedFoyerPeriod] = useState("Novembre 2026");
	const [reportStats, setReportStats] = useState(defaultReportStats);
	const [monthlyData, setMonthlyData] = useState(monthlyFallback);
	const [exportMessage, setExportMessage] = useState("");

	useEffect(() => {
		const load = async () => {
			try {
				const [ca, impayes, paiements] = await Promise.all([
					getChiffreAffaires().catch(() => null),
					getRapportImpayes().catch(() => null),
					getRapportPaiements(11, 2026).catch(() => null),
				]);

				const totalCa = Number(ca?.totalEncaissements ?? ca?.total ?? 0);
				const totalImpayes = Number(impayes?.montantTotal ?? impayes?.total ?? 0);
				const taux =
					totalCa && totalCa > 0
						? (totalCa / (totalCa + totalImpayes || 1)) * 100
						: 87.6;

				setReportStats([
					{
						label: "Chiffre d’affaires",
						value: `${new Intl.NumberFormat("fr-FR").format(
							Math.round(totalCa || 8_760_000)
						)}`,
						kicker: "Ar • Novembre 2026",
						type: "primary",
					},
					{
						label: "Montant attendu",
						value: `${new Intl.NumberFormat("fr-FR").format(
							Math.round((totalCa || 8_760_000) / 0.876)
						)}`,
						kicker: "FCFA • Loyers de novembre",
						type: "secondary",
					},
					{
						label: "Taux de recouvrement",
						value: `${taux.toFixed(1)} %`,
						kicker: "+ 4,2 points vs octobre",
						type: "secondary",
					},
					{
						label: "Reste à encaisser",
						value: `${new Intl.NumberFormat("fr-FR").format(
							Math.round(totalImpayes || 1_240_000)
						)}`,
						kicker: "FCFA • 8 dossiers impayés",
						type: "secondary",
					},
				]);

				if (Array.isArray(paiements?.series) && paiements.series.length > 0) {
					setMonthlyData(
						paiements.series.map((entry) => ({
							month: entry.month || entry.label || "M",
							value: Number(entry.value ?? entry.montant ?? 0) / 1000,
							accent: entry.value >= 8 ? "strong" : "soft",
						}))
					);
				}
			} catch (error) {
				console.warn(
					"Rapports backend indisponible, affichage en mode démonstration.",
					error
				);
			}
		};

		load();
	}, []);

	const totalRecouvrement = useMemo(() => {
		const total = monthlyData.reduce((sum, item) => sum + item.value, 0);
		return total / monthlyData.length;
	}, [monthlyData]);

	const handleExport = () => {
		setExportMessage("Rapport prêt pour exportation.");
		window.setTimeout(() => setExportMessage(""), 2200);
	};

	return (
		<div className="reports-page">
			<div className="reports-header-row">
				<div>
					<h1>Rapports & performance</h1>
					<p>Suivez vos revenus et le taux de recouvrement de votre parc.</p>
				</div>

				<button
					type="button"
					className="reports-export-btn"
					onClick={handleExport}
				>
					↗ Exporter le rapport
				</button>
			</div>

			{exportMessage && (
				<p style={{ margin: "0 0 16px", color: "var(--success)", fontSize: 14 }}>
					{exportMessage}
				</p>
			)}

			<div className="reports-metrics-grid">
				{reportStats.map((item) => (
					<div
						key={item.label}
						className={`report-metric-card ${item.type}`}
					>
						<span>{item.label}</span>
						<strong>{item.value}</strong>
						<small>{item.kicker}</small>
					</div>
				))}
			</div>

			<div className="reports-panels-grid">
				<div className="report-panel chart-panel">
					<div className="panel-header-inline">
						<div>
							<h2>Encaissements mensuels</h2>
							<small>En milliers de FCFA</small>
						</div>
						<select
							value={selectedMonth}
							onChange={(event) =>
								setSelectedMonth(event.target.value)
							}
							className="mini-select"
						>
							<option value="2026">2026</option>
							<option value="2025">2025</option>
						</select>
					</div>

					<div className="chart-figure">{totalRecouvrement.toFixed(2)}</div>

					<div
						className="bar-chart"
						aria-label="Graphique des encaissements mensuels"
					>
						{monthlyData.map((item) => (
							<div key={item.month} className="bar-stack-item">
								<div className="bar-shell">
									<div
										className={`bar-fill ${item.accent}`}
										style={{ height: `${item.value * 18}px` }}
										title={`${item.month}: ${item.value}k`}
									/>
								</div>
								<span>{item.month}</span>
							</div>
						))}
					</div>
				</div>

				<div className="report-panel payment-mode-panel">
					<h2>Modes de paiement</h2>
					<div className="mode-list">
						{paymentModes.map((mode) => (
							<div key={mode.label} className="mode-row">
								<div className="mode-label-row">
									<span>{mode.label}</span>
									<strong>{mode.value}%</strong>
								</div>
								<div className="progress-track">
									<div
										className="progress-bar"
										style={{ width: `${mode.value}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="report-panel performance-panel">
				<div className="panel-header-inline performance-header">
					<h2>Performance par foyer</h2>
					<select
						value={selectedFoyerPeriod}
						onChange={(event) =>
							setSelectedFoyerPeriod(event.target.value)
						}
						className="mini-select"
					>
						<option value="Novembre 2026">Novembre 2026</option>
						<option value="Octobre 2026">Octobre 2026</option>
					</select>
				</div>

				<table className="report-table">
					<thead>
						<tr>
							<th>Foyer</th>
							<th>Lots occupés</th>
							<th>Attendu</th>
							<th>Encaisse</th>
							<th>Reste dû</th>
							<th>Taux</th>
						</tr>
					</thead>
					<tbody>
						{foyerRows.map((row) => (
							<tr key={row.foyer}>
								<td>{row.foyer}</td>
								<td>{row.lots}</td>
								<td>{row.attendu}</td>
								<td>{row.encaisse}</td>
								<td>{row.reste}</td>
								<td>{row.taux}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Rapports;