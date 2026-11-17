import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle";
import axiosInstance from "../../api/axiosInstance";

const defaultUsers = [
  { id: 1, nom: "Marie Kouamé", email: "marie.kuame@entreprise.com", role: "Administrateur", statut: "Actif", derniereConnexion: "13 nov. - 08:42" },
  { id: 2, nom: "David N’Dri", email: "david.ndri@entreprise.com", role: "Administrateur", statut: "Actif", derniereConnexion: "12 nov. - 17:15" },
  { id: 3, nom: "Aïcha Diallo", email: "aicha.diallo@email.com", role: "Locataire", statut: "Actif", derniereConnexion: "13 nov. - 09:10" },
  { id: 4, nom: "Jean Mensah", email: "jean.mensah@email.com", role: "Locataire", statut: "Actif", derniereConnexion: "12 nov. - 18:03" },
  { id: 5, nom: "Fatou Koné", email: "fatou.kone@email.com", role: "Locataire", statut: "Actif", derniereConnexion: "11 nov. - 11:40" },
  { id: 6, nom: "Nadia Coulibaly", email: "nadia.coulibaly@email.com", role: "Locataire", statut: "En attente", derniereConnexion: "Invit. envoyée" },
];

function Parametres() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
  });
  const [users, setUsers] = useState(defaultUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous les rôles");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get("/utilisateurs");
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((u) => ({
            id: u.idUtilisateur || u.id,
            nom: `${u.prenom || ""} ${u.nom || ""}`.trim() || "Utilisateur",
            email: u.email,
            role: u.role?.libelle || u.role || "ADMIN",
            statut: u.statut || "Actif",
            derniereConnexion: u.derniereConnexion ? new Date(u.derniereConnexion).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "Jamais",
          }));
          setUsers(mapped);
        }
      } catch (error) {
        console.warn("Paramètres: utilisateurs back indisponibles", error);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setForm({
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      email: user?.email || "",
      telephone: user?.telephone || "",
    });
  }, [user]);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesSearch = `${item.nom} ${item.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "Tous les rôles" || item.role === roleFilter;
      const matchesStatus = statusFilter === "Tous les statuts" || item.statut === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = user?.id || user?.idUtilisateur;
      if (id) {
        await axiosInstance.put(`/auth/profil/${id}`, {
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone,
        });
      }
      setMessage("Profil mis à jour avec succès.");
    } catch (error) {
      setMessage("Profil mis à jour (démo local)");
    }
  };

  const inviteLocataire = () => {
    setMessage("Invitation envoyée au locataire sélectionné.");
  };

  const handleMore = (userName) => {
    setMessage(`Actions disponibles pour ${userName}.`);
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h2>Paramètres</h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            Gérez votre compte et les préférences de l’application
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900 }}>
        {/* Profil */}
        <div className="card">
          <h3>Mon profil</h3>
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
            />
            <input
              className="input"
              name="prenom"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
            />
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              className="input"
              name="telephone"
              placeholder="Téléphone"
              value={form.telephone}
              onChange={handleChange}
            />

            {message && <p style={{ color: "green" }}>{message}</p>}

            <button className="btn" type="submit">
              Enregistrer
            </button>
          </form>
        </div>

        {/* Préférences */}
        <div className="card">
          <h3>Préférences</h3>

          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 14 }}>Thème</p>
            <ThemeToggle />
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 14 }}>Notifications</p>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <input type="checkbox" defaultChecked />
              Recevoir les alertes d’impayés
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginTop: 8 }}>
              <input type="checkbox" defaultChecked />
              Recevoir les nouvelles réclamations
            </label>
          </div>

          <div>
            <p style={{ margin: "0 0 8px", fontSize: 14 }}>Compte</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Rôle : {user?.role || "ADMIN"}
            </p>
          </div>
        </div>
      </div>

      <div className="users-page">
        <div className="users-breadcrumb">
          <span>Gestion locative</span>
          <span className="users-breadcrumb-separator">/</span>
          <span className="users-current-page">Utilisateurs</span>
        </div>

        <div className="users-header-row">
          <div>
            <h1>Utilisateurs & accès</h1>
            <p>Des comptes sécurisés, des rôles clairement définis.</p>
          </div>

          <button type="button" className="invite-btn" onClick={inviteLocataire}>
            + Inviter un locataire
          </button>
        </div>

        <div className="users-summary-grid">
          <div className="user-summary-card">
            <span>Utilisateurs</span>
            <strong>{users.length}</strong>
            <small>{users.filter((u) => String(u.role).toUpperCase().includes("ADMIN")).length} administrateurs • {users.filter((u) => String(u.role).toUpperCase().includes("LOCAT")).length} locataires</small>
          </div>

          <div className="user-summary-card">
            <span>Invitations en attente</span>
            <strong>{users.filter((u) => String(u.statut).toLowerCase().includes("attente")).length}</strong>
            <small>Mot de passe temporaire transmis</small>
          </div>

          <div className="user-summary-card">
            <span>Comptes actifs</span>
            <strong>{users.filter((u) => String(u.statut).toLowerCase() === "actif").length}</strong>
            <small>Accès à l’espace personnel</small>
          </div>
        </div>

        <div className="users-toolbar">
          <div className="users-search-wrap">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un nom, un e-mail..."
            />
          </div>

          <div className="users-select-wrap">
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option>Tous les rôles</option>
              <option>Administrateur</option>
              <option>Locataire</option>
            </select>
          </div>

          <div className="users-select-wrap">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>En attente</option>
            </select>
          </div>
        </div>

        <div className="users-table-panel">
          <table className="users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Adresse e-mail</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière connexion</th>
                <th className="users-actions-col"> </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => (
                <tr key={item.id}>
                  <td>{item.nom}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className={`role-badge ${item.role === "Administrateur" ? "admin" : "tenant"}`}>{item.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.statut === "Actif" ? "active" : "pending"}`}>{item.statut}</span>
                  </td>
                  <td>{item.derniereConnexion}</td>
                  <td className="users-actions-col">
                    <button type="button" className="more-btn" onClick={() => handleMore(item.nom)} aria-label={`Plus d’actions pour ${item.nom}`}>
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="users-footer">
          <span>{filteredUsers.length} utilisateurs affichés • {users.length} au total</span>
          <div className="users-pagination">
            <button type="button" className="pagination-arrow">←</button>
            <button type="button" className="page-number active">1</button>
            <button type="button" className="page-number">2</button>
            <button type="button" className="page-number">3</button>
            <button type="button" className="pagination-arrow">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Parametres;