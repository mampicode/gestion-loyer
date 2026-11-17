import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo-akany-flm.png";

function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const breadcrumbMap = {
    "/admin": "Vue d'ensemble",
    "/admin/foyers": "Foyers",
    "/admin/contrats": "Contrats",
    "/admin/paiements": "Paiements",
    "/admin/impayes": "Impayés",
    "/admin/reclamations": "Réclamations",
    "/admin/parametres": "Utilisateurs",
    "/admin/rapports": "Rapports",
  };

  const currentBreadcrumb =
    Object.entries(breadcrumbMap).find(([path]) => location.pathname === path || location.pathname.startsWith(path))?.[1] ||
    "Vue d'ensemble";

  const navItems = [
    { to: "/admin", label: "Vue d'ensemble", exact: true },
    { to: "/admin/foyers", label: "Foyers & lots" },
    { to: "/admin/contrats", label: "Contrats" },
    { to: "/admin/paiements", label: "Paiements" },
    { to: "/admin/impayes", label: "Impayés" },
    { to: "/admin/reclamations", label: "Réclamations" },
    { to: "/admin/parametres", label: "Utilisateurs" },
    { to: "/admin/rapports", label: "Rapports" },
  ];

  const userName = `${user?.prenom ?? "Marie"} ${user?.nom ?? "Kouamé"}`.trim();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">
              <img src={logo} alt="Akany FLM" className="sidebar-brand-svg" />
            </div>
            <div className="sidebar-brand-text">Akany FLM</div>
          </div>
          <div className="sidebar-role">ESPACE ADMINISTRATEUR</div>
        </div>

        <nav className="sidebar-menu" aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={
                item.exact
                  ? location.pathname === item.to
                    ? "sidebar-item active"
                    : "sidebar-item"
                  : isActive(item.to)
                    ? "sidebar-item active"
                    : "sidebar-item"
              }
            >
              <span className="sidebar-item-icon">
                {item.label === "Vue d'ensemble" && "▣"}
                {item.label === "Foyers & lots" && "▤"}
                {item.label === "Contrats" && "▣"}
                {item.label === "Paiements" && "◫"}
                {item.label === "Impayés" && "△"}
                {item.label === "Réclamations" && "◍"}
                {item.label === "Utilisateurs" && "◌"}
                {item.label === "Rapports" && "▥"}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-utility">
            <span className="utility-icon">☼</span>
            Mode clair
          </button>
          <button type="button" className="sidebar-utility logout" onClick={handleLogout}>
            <span className="utility-icon">↪</span>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <span>Gestion locative</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{currentBreadcrumb}</strong>
          </div>

          <div className="topbar-actions">
            <button type="button" className="icon-button" aria-label="Recherche">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="topbar-icon-svg">
                <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 16L21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <button type="button" className="icon-button notification-button" aria-label="Notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="topbar-icon-svg">
                <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
                <path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <span className="notification-dot" aria-hidden="true" />
            </button>
            <div className="user-chip">
              <div className="user-avatar">MK</div>
              <div className="user-meta">
                <span className="user-name">{userName}</span>
                <small>Administratrice</small>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;