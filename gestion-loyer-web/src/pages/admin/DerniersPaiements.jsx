import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDerniersPaiements } from "../../services/dashboardService";

function DerniersPaiements() {
  const navigate = useNavigate();
  const [paiements, setPaiements] = useState([]);

  useEffect(() => {
    getDerniersPaiements().then(setPaiements);
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Derniers paiements</h3>
        <button
          onClick={() => navigate("/admin/paiements")}
          style={{ color: "#0d9488", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
        >
          Tout voir →
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)" }}>
            <th style={{ padding: "10px 8px" }}>Locataire</th>
            <th style={{ padding: "10px 8px" }}>Date</th>
            <th style={{ padding: "10px 8px" }}>Montant</th>
            <th style={{ padding: "10px 8px" }}>Mode</th>
            <th style={{ padding: "10px 8px" }}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {paiements.map((p) => (
            <tr
              key={p.idPaiement}
              style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ padding: "12px 8px" }}>{p.locataireNom || "—"}</td>
              <td style={{ padding: "12px 8px" }}>{formatDate(p.datePaiement)}</td>
              <td style={{ padding: "12px 8px", fontWeight: 600 }}>{p.montant?.toLocaleString()} Ar</td>
              <td style={{ padding: "12px 8px" }}>{p.modePaiement || "—"}</td>
              <td style={{ padding: "12px 8px" }}>
                <span style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                }}>
                  Validé
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {paiements.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 20 }}>
          Aucun paiement pour le moment.
        </p>
      )}
    </div>
  );
}

export default DerniersPaiements;