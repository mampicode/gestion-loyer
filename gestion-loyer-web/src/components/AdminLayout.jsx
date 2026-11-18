import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo-akany-flm.png";

function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setIsDarkMode(!isDarkMode);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const breadcrumbMap = {
    "/admin": "Vue d'ensemble",
    "/admin/foyers": "Foyers",
    "/admin/contrats": "Contrats",
    "/admin/paiements": "Paiements",
    "/admin/impayes": "Impayés",
    "/admin/reclamations": "Réclamations",
    "/admin/parametres": "Locataires",
    "/admin/rapports": "Rapports",
    "/admin/lots": "Lots",
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
    { to: "/admin/parametres", label: "Locataires" },
    { to: "/admin/rapports", label: "Rapports" },
    { to: "/admin/lots", label: "Lots" },
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
                {item.label === "Locataires" && "◌"}
                {item.label === "Rapports" && "▥"}
                {item.label === "Lots" && "▦"}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-utility" onClick={toggleTheme} aria-label="Changer le thème">
            <span className="utility-icon">☼</span>
            {theme === "light" ? "Mode sombre" : "Mode clair"}
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
            <div className="topbar-popover-wrap">
              <button type="button" className="icon-button" aria-label="Recherche" aria-expanded={searchOpen} onClick={() => { setSearchOpen((value) => !value); setNotificationsOpen(false); }}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="topbar-icon-svg"><circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M16 16L21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
              {searchOpen && <div className="topbar-popover search-popover"><input autoFocus type="search" placeholder="Rechercher une page..." onChange={(event) => { const value = event.target.value.toLowerCase(); const match = navItems.find((item) => item.label.toLowerCase().includes(value)); if (match && value) window.requestAnimationFrame(() => {}); }} /><div className="popover-links">{navItems.map((item) => <Link key={item.to} to={item.to} onClick={() => setSearchOpen(false)}>{item.label}</Link>)}</div></div>}
            </div>
            <div className="topbar-popover-wrap">
              <button type="button" className="icon-button notification-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((value) => !value); setSearchOpen(false); }}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="topbar-icon-svg"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" /><path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                <span className="notification-dot" aria-hidden="true" />
              </button>
              {notificationsOpen && <div className="topbar-popover notification-popover"><strong>Notifications</strong><button type="button" onClick={() => { setNotificationsOpen(false); navigate("/admin/impayes"); }}>8 loyers en retard</button><button type="button" onClick={() => { setNotificationsOpen(false); navigate("/admin/reclamations"); }}>3 réclamations ouvertes</button></div>}
            </div>
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