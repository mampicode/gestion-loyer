import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFoyers, searchFoyers } from "../../services/foyerService";

const sampleFoyers = [
	{
		idFoyer: 1,
		nom: "Les Acacias",
		typeFoyer: "Immeuble",
		ville: "Cocody",
		quartier: "Adjiban",
		adresse: "Cocody – Adjiban",
		lots: 24,
		occupes: 22,
		loyerMensuel: 3300000,
	},
	{
		idFoyer: 2,
		nom: "Résidence Horizon",
		typeFoyer: "Immeuble",
		ville: "Marcory",
		quartier: "Adjiban",
		adresse: "Marcory – Adjiban",
		lots: 20,
		occupes: 18,
		loyerMensuel: 3240000,
	},
	{
		idFoyer: 3,
		nom: "Villa Les Palmiers",
		typeFoyer: "Maison",
		ville: "Riviera",
		quartier: "Abidjan",
		adresse: "Riviera – Abidjan",
		lots: 1,
		occupes: 1,
		loyerMensuel: 250000,
	},
	{
		idFoyer: 4,
		nom: "Résidence Émeraude",
		typeFoyer: "Immeuble",
		ville: "Angré",
		quartier: "Abidjan",
		adresse: "Angré – Abidjan",
		lots: 16,
		occupes: 14,
		loyerMensuel: 2100000,
	},
	{
		idFoyer: 5,
		nom: "Résidence Soleil",
		typeFoyer: "Immeuble",
		ville: "Yopougon",
		quartier: "Treichville",
		adresse: "Yopougon – Treichville",
		lots: 18,
		occupes: 15,
		loyerMensuel: 2800000,
	},
	{
		idFoyer: 6,
		nom: "Villa Azur",
		typeFoyer: "Maison",
		ville: "Plateau",
		quartier: "Abidjan",
		adresse: "Plateau – Abidjan",
		lots: 2,
		occupes: 2,
		loyerMensuel: 420000,
	},
	{
		idFoyer: 7,
		nom: "Complexe Le Nyl",
		typeFoyer: "Immeuble",
		ville: "Koumassi",
		quartier: "Sogefiha",
		adresse: "Koumassi – Sogefiha",
		lots: 12,
		occupes: 9,
		loyerMensuel: 1800000,
	},
	{
		idFoyer: 8,
		nom: "Résidence Mimosas",
		typeFoyer: "Immeuble",
		ville: "Abobo",
		quartier: "Derrière la gare",
		adresse: "Abobo – Derrière la gare",
		lots: 15,
		occupes: 12,
		loyerMensuel: 2150000,
	},
];

function Foyers() {
	const navigate = useNavigate();
	const [foyers, setFoyers] = useState(sampleFoyers);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("Tous les types");
	const [viewMode, setViewMode] = useState("list");
	const [page, setPage] = useState(1);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await getFoyers();
				if (Array.isArray(data) && data.length > 0) {
					setFoyers(data);
				}
			} catch (error) {
				setFoyers(sampleFoyers);
			}
		};
		load();
	}, []);

	const filteredFoyers = useMemo(() => {
		const query = search.trim().toLowerCase();
		return foyers.filter((foyer) => {
			const matchesQuery =
				!query ||
				foyer.nom?.toLowerCase().includes(query) ||
				foyer.adresse?.toLowerCase().includes(query) ||
				foyer.ville?.toLowerCase().includes(query) ||
				foyer.quartier?.toLowerCase().includes(query);

			const matchesType =
				typeFilter === "Tous les types" ||
				foyer.typeFoyer === typeFilter ||
				(typeFilter === "Immeuble" && (foyer.typeFoyer === "Immeuble" || !foyer.typeFoyer)) ||
				(typeFilter === "Maison" && foyer.typeFoyer === "Maison");

			return matchesQuery && matchesType;
		});
	}, [foyers, search, typeFilter]);

	const pageSize = 4;
	const totalPages = Math.max(1, Math.ceil(filteredFoyers.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	useEffect(() => {
		setPage(1);
	}, [search, typeFilter]);

	const pageItems = filteredFoyers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const handleSearch = async (value) => {
		setSearch(value);
		if (value.trim()) {
			try {
				const data = await searchFoyers(value.trim());
				if (Array.isArray(data) && data.length > 0) {
					setFoyers(data);
				}
			} catch (error) {
				// ignore and keep local data
			}
		}
	};

	return (
		<div className="foyers-page-shell">
			<div className="foyers-page-panel">
				<div className="foyers-header-row">
					<div className="foyers-header-copy">
						<h1>Foyers &amp; lots</h1>
						<p>12 foyers · 96 lots · Une vue claire sur votre patrimoine.</p>
					</div>
					<button
						type="button"
						className="foyer-primary-btn"
						onClick={() => navigate("/admin/foyers/nouveau")}
					>
						+ Nouveau foyer
					</button>
				</div>

				<div className="foyers-toolbar">
					<div className="foyers-search-box">
						<span className="search-icon" aria-hidden="true">
							⌕
						</span>
						<input
							type="text"
							value={search}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder="Rechercher un foyer, une adresse..."
						/>
					</div>

					<div className="foyers-filter-box">
						<select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
							<option>Tous les types</option>
							<option>Immeuble</option>
							<option>Maison</option>
						</select>

						<div className="view-toggle" role="tablist" aria-label="Vue des foyers">
							<button
								type="button"
								className={viewMode === "list" ? "view-toggle-btn active" : "view-toggle-btn"}
								onClick={() => setViewMode("list")}
							>
								Liste
							</button>
							<button
								type="button"
								className={viewMode === "card" ? "view-toggle-btn active" : "view-toggle-btn"}
								onClick={() => setViewMode("card")}
							>
								Carte
							</button>
						</div>
					</div>
				</div>

				<div className={viewMode === "card" ? "foyers-card-grid" : "foyers-card-grid list-view"}>
					{pageItems.map((foyer) => (
						<article key={foyer.idFoyer ?? foyer.nom} className="foyer-card">
							<div className="foyer-card-topbar">
								<span className="foyer-card-type">{foyer.typeFoyer || "Immeuble"}</span>
								<button type="button" className="foyer-more-btn" aria-label="Plus d'options">
									•••
								</button>
							</div>

							<div className="foyer-card-body">
								<h2>{foyer.nom}</h2>
								<p className="foyer-city">
									{foyer.ville || "Abidjan"} · {foyer.quartier || "Adjiban"}
								</p>
							</div>

							<div className="foyer-stats-row">
								<div className="foyer-stat">
									<span className="foyer-stat-label">LOTS</span>
									<strong>{foyer.lots ?? foyer.nbrLots ?? 0}</strong>
								</div>
								<div className="foyer-stat">
									<span className="foyer-stat-label">OCCUPÉS</span>
									<strong>{foyer.occupes ?? foyer.nbOccuper ?? 0}</strong>
								</div>
								<div className="foyer-stat revenue">
									<span className="foyer-stat-label">LOYERS MENSUELS</span>
									<strong>
										{Number(foyer.loyerMensuel ?? foyer.loyer ?? 0).toLocaleString("fr-FR")} Ar
									</strong>
								</div>
							</div>

							<button
								type="button"
								className="foyer-detail-link"
								onClick={() => navigate(`/admin/foyers/${foyer.idFoyer ?? 1}`)}
							>
								Voir le foyer <span aria-hidden="true">→</span>
							</button>
						</article>
					))}
				</div>

				<div className="foyers-footer-row">
					<div className="foyers-count">{filteredFoyers.length} foyers sur 12</div>
					<div className="pagination-box">
						<button
							type="button"
							className="pagination-arrow"
							disabled={currentPage === 1}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
						>
							←
						</button>
						{[1, 2, 3].map((pageIndex) => (
							<button
								key={pageIndex}
								type="button"
								className={currentPage === pageIndex ? "page-number active" : "page-number"}
								onClick={() => setPage(pageIndex)}
							>
								{pageIndex}
							</button>
						))}
						<button
							type="button"
							className="pagination-arrow"
							disabled={currentPage === totalPages}
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						>
							→
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Foyers;