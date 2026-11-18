import { useEffect, useState } from "react";
import { getAlertes } from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";

function AlertesSection() {
  const navigate = useNavigate();
  const [alertes, setAlertes] = useState({
    nbImpayes: 0,
    totalDu: 0,
    nbReclamations: 0,
  });

  useEffect(() => {
    getAlertes().then(setAlertes);
  }, []);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>À votre attention</h3>
        <span style={{ background: "#fef3c7", padding: "4px 10px", borderRadius: 20, fontSize: 13 }}>
          {alertes.nbImpayes + alertes.nbReclamations}
        </span>
      </div>

      <div style={{ marginTop: 16 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          {alertes.nbImpayes} loyer(s) en retard
        </p>
        <p style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: 14 }}>
          {alertes.totalDu.toLocaleString()} Ar à recouvrer
        </p>
        <button
          onClick={() => navigate("/admin/impayes")}
          style={{ color: "#0d9488", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Voir les impayés →
        </button>
      </div>

      <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid var(--border)" }} />

      <div>
        <p style={{ margin: 0, fontWeight: 600 }}>
          {alertes.nbReclamations} réclamation(s) ouverte(s)
        </p>
        <p style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: 14 }}>
          {alertes.nbReclamations > 0 ? "Demandes à traiter" : "Aucune demande en attente"}
        </p>
        <button
          onClick={() => navigate("/admin/reclamations")}
          style={{ color: "#0d9488", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Voir les réclamations →
        </button>
      </div>
    </div>
  );
}

export default AlertesSection;