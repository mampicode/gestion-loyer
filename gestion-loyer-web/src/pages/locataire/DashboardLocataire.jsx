import { useAuth } from "../../context/AuthContext";

function DashboardLocataire() {
  const { user } = useAuth();

  return (
    <div>
      
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Bienvenue {user?.prenom} {user?.nom}
      </p>

      <div className="grid">
        <div className="card">
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
            Solde à payer
          </p>
          <h3 style={{ margin: "8px 0 0", fontSize: 28, color: "#ef4444" }}>
            0 Ar
          </h3>
        </div>

        <div className="card">
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
            Prochaine échéance
          </p>
          <h3 style={{ margin: "8px 0 0", fontSize: 20 }}>
            —
          </h3>
        </div>

        <div className="card">
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
            Réclamations ouvertes
          </p>
          <h3 style={{ margin: "8px 0 0", fontSize: 28, color: "#f59e0b" }}>
            0
          </h3>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>Actions rapides</h3>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button className="btn">Payer mon loyer</button>
          <button className="btn btn-secondary">Voir mes quittances</button>
          <button className="btn btn-secondary">Signaler un problème</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardLocataire;