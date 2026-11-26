import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo-akany-flm.png";

function LocataireLayout() {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/locataire", label: "Mon espace", icon: "▣" },
    { to: "/locataire/paiements", label: "Mes paiements", icon: "▣" },
    { to: "/locataire/contrat", label: "Mon contrat", icon: "▤" },
    { to: "/locataire/reclamations", label: "Réclamations", icon: "▱" },
  ];

  const firstName = user?.prenom || "Aicha";
  const lastName = user?.nom || "Diallo";
  const initials = `${firstName[0] || "A"}${lastName[0] || "D"}`.toUpperCase();
  const breadcrumb = location.pathname.includes("paiements") ? "Mes paiements" : location.pathname.includes("contrat") ? "Mon contrat" : location.pathname.includes("reclamations") ? "Réclamations" : "Mon espace";

  return (
    <div className="locataire-app app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark"><img src={logo} alt="Akany FLM" className="sidebar-brand-svg" /></div>
            <div className="sidebar-brand-text">Akany FLM</div>
          </div>
          <div className="sidebar-role">ESPACE LOCATAIRE</div>
        </div>
        <nav className="sidebar-menu">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={location.pathname === item.to ? "sidebar-item active" : "sidebar-item"}>
              <span className="sidebar-item-icon">{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="sidebar-utility" onClick={toggleTheme}><span className="utility-icon">☼</span>{theme === "light" ? "Mode sombre" : "Mode clair"}</button>
          <button type="button" className="sidebar-utility logout" onClick={() => { logoutUser(); navigate("/login"); }}><span className="utility-icon">↪</span>Déconnexion</button>
        </div>
      </aside>
      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-breadcrumb"><span>Espace locataire</span><span className="breadcrumb-separator">/</span><strong>{breadcrumb}</strong></div>
          <div className="topbar-actions">
            <button type="button" className="icon-button" aria-label="Rechercher">⌕</button>
            <button type="button" className="icon-button" aria-label="Notifications">♧</button>
            <div className="user-chip"><div className="user-avatar">{initials}</div><div className="user-meta"><span className="user-name">{firstName} {lastName}</span><small>Locataire • A-204</small></div></div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}

export default LocataireLayout;