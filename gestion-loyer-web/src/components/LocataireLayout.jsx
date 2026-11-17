import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

function LocataireLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", textTransform: "uppercase" }}>
    Compte connecté
  </p>
  <p style={{ margin: 0, fontWeight: 600 }}>
    {user?.nom} {user?.prenom}
  </p>
  <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
    {user?.email}
  </p>
</div>

        <Link to="/locataire" className={isActive("/locataire") ? "active" : ""}>
          Mon espace
        </Link>

        <p className="sidebar-section">Paiements</p>
        <Link to="/locataire/solde" className={isActive("/locataire/solde") ? "active" : ""}>
          Voir mon solde
        </Link>
        <Link to="/locataire/payer" className={isActive("/locataire/payer") ? "active" : ""}>
          Payer mon loyer
        </Link>
        <Link to="/locataire/quittances" className={isActive("/locataire/quittances") ? "active" : ""}>
          Mes quittances
        </Link>

        <p className="sidebar-section">Support</p>
        <Link to="/locataire/reclamation" className={isActive("/locataire/reclamation") ? "active" : ""}>
          Signaler un problème
        </Link>

        <p className="sidebar-section">Compte</p>
        <Link to="/locataire/profil" className={isActive("/locataire/profil") ? "active" : ""}>
          Mon compte
        </Link>
      </aside>

      <main className="main">
        <div className="topbar">
          <h3>Espace Locataire</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span>{user?.prenom} {user?.nom}</span>
            <ThemeToggle />
            <button className="btn btn-secondary" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default LocataireLayout;