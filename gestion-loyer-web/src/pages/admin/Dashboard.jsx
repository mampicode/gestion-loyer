import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStats } from "../../services/dashboardService";
import { getPaiements } from "../../services/paiementService";
import { useNavigate } from "react-router-dom";

const monthLabels = [
  "Janv.",
  "Fév.",
  "Mars",
  "Avr.",
  "Mai",
  "Juin",
  "Juil.",
  "Août",
  "Sept.",
  "Oct.",
  "Nov.",
  "Déc.",
];

const buildMonthlySeries = (payments = []) => {
  const now = new Date();
  const series = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      month: monthLabels[date.getMonth()],
      value: 0,
      accent: index >= 3 ? "strong" : "soft",
    };
  });

  const totals = payments.reduce((acc, payment) => {
    const rawDate = payment.datePaiement || payment.dateCreation || payment.date || new Date();
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return acc;

    const status = String(payment.statut || "").toUpperCase();
    if (status && status !== "VALIDE" && status !== "VALIDÉ" && status !== "OK") return acc;

    const amount = Number(payment.montant ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) return acc;

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    acc[monthKey] = (acc[monthKey] || 0) + amount;
    return acc;
  }, {});

  series.forEach((entry) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - series.indexOf(entry)), 1);
    const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
    const total = totals[monthKey] || 0;
    entry.value = Number((total / 1000).toFixed(1));
  });

  return series;
};

const paymentRows = [
  {
    locataire: "Aicha Diallo",
    foyer: "Les Acacias - A-204",
    date: "10 nov. 2026",
    montant: "100 000 Ar",
    mode: "Mobile Money",
    statut: "Validé",
  },
  {
    locataire: "Jean Mensah",
    foyer: "Horizon B-102",
    date: "09 nov. 2026",
    montant: "180 000 Ar",
    mode: "Virement",
    statut: "Validé",
  },
  {
    locataire: "Fatou Koné",
    foyer: "Les Acacias - A-108",
    date: "08 nov. 2026",
    montant: "150 000 Ar",
    mode: "Espèces",
    statut: "Validé",
  },
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    foyers: 0,
    lotsOccupe: 0,
    totalLots: 0,
    contrats: 0,
    impayes: 0,
    locataires: 0,
    reclamations: 0,
  });
  const [monthlySeries, setMonthlySeries] = useState(
    Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(new Date().getFullYear(), new Date().getMonth() - (5 - index), 1);
      return {
        month: monthLabels[monthDate.getMonth()],
        value: 0,
        accent: index >= 3 ? "strong" : "soft",
      };
    })
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStats();
        if (data) {
          setStats({
            foyers: data.foyers ?? 0,
            lotsOccupe: data.lotsOccupe ?? 0,
            totalLots: data.totalLots ?? 0,
            contrats: data.contrats ?? 0,
            impayes: data.impayes ?? 0,
            locataires: data.locataires ?? 0,
            reclamations: data.reclamations ?? 0,
          });
        }

        const payments = await getPaiements().catch(() => []);
        setMonthlySeries(buildMonthlySeries(Array.isArray(payments) ? payments : []));
      } catch (error) {
        // silent fallback: no demo values
      }
    };
    load();
  }, []);

  const chartTotal = monthlySeries.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-row">
        <div className="dashboard-title-block">
          <h1>Votre parc, en un coup d'œil</h1>
          <p>Vendredi 13 novembre 2026 - Voici la situation de vos résidences.</p>
        </div>

        <button type="button" className="dashboard-date-filter">
          Novembre 2026
        </button>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Foyers</div>
          <div className="metric-value">{stats.foyers}</div>
          <div className="metric-foot">8 immeubles - 4 maisons</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Lots occupés</div>
          <div className="metric-value">
            {stats.lotsOccupe} / {stats.totalLots}
          </div>
          <div className="metric-foot">
            {stats.totalLots > 0
              ? `${((stats.lotsOccupe / stats.totalLots) * 100).toFixed(1)} % de taux d'occupation`
              : "0,0 % de taux d'occupation"}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Contrats actifs</div>
          <div className="metric-value">{stats.contrats}</div>
          <div className="metric-foot">3 renouvellements ce mois</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Impayés</div>
          <div className="metric-value danger">
            {stats.impayes.toLocaleString("fr-FR")} Ar
          </div>
          <div className="metric-foot">8 locataires à relancer</div>
        </div>
      </div>

      <div className="dashboard-lower-grid">
        <section className="panel panel-chart">
          <div className="panel-header">
            <div>
              <h2>Encaissements mensuels</h2>
              <span>En milliers d'Ar</span>
            </div>
            <button type="button" className="mini-select">
              2026
            </button>
          </div>

          <div
            className="bar-chart"
            aria-label="Graphique d'encaissements mensuels"
          >
            {monthlySeries.map((item) => (
              <div key={item.month} className="bar-group">
                <div className="bar-stack">
                  <div
                    className={`bar ${item.accent}`}
                    style={{ height: `${Math.max(item.value * 14, 6)}px` }}
                    title={`${item.month}: ${item.value}k Ar`}
                  />
                </div>
                <span className="bar-month">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="chart-total">{chartTotal.toFixed(2)}</div>
        </section>

        <aside className="panel panel-alerts">
          <div className="panel-header alerts-header">
            <h2>À votre attention</h2>
            <span className="alert-badge">8</span>
          </div>

          <div className="alert-item">
            <strong>8 loyers en retard</strong>
            <span>1 240 000 Ar à recouvrer</span>
            <button
              type="button"
              className="text-link"
              onClick={() => navigate("/admin/impayes")}
            >
              Voir les impayés →
            </button>
          </div>

          <div className="alert-item">
            <strong>3 réclamations ouvertes</strong>
            <span>1 demande à traiter en priorité</span>
            <button
              type="button"
              className="text-link"
              onClick={() => navigate("/admin/reclamations")}
            >
              Voir les réclamations →
            </button>
          </div>
        </aside>
      </div>

      <section className="panel panel-table">
        <div className="panel-header table-header">
          <h2>Derniers paiements</h2>
          <button
            type="button"
            className="text-link table-link"
            onClick={() => navigate("/admin/paiements")}
          >
            Tout voir →
          </button>
        </div>

        <table className="payments-table">
          <thead>
            <tr>
              <th>Locataire</th>
              <th>Foyer / lot</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {paymentRows.map((row) => (
              <tr key={`${row.locataire}-${row.date}`}>
                <td>{row.locataire}</td>
                <td>{row.foyer}</td>
                <td>{row.date}</td>
                <td>{row.montant}</td>
                <td>{row.mode}</td>
                <td>
                  <span className="status-pill">{row.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Dashboard;