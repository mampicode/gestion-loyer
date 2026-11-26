import { useEffect, useMemo, useState } from "react";
import { registerLocataire } from "../../services/authService";
import { getLocataires, getUtilisateurs } from "../../services/locataireService";

const initialForm = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  adresse: "",
  pieceIdentite: "",
};

function LocatairesPage() {
  const [locataires, setLocataires] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous les rôles");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const pageSize = 6;

  const load = async () => {
    const [locataireData, utilisateurData] = await Promise.all([
      getLocataires().catch(() => []),
      getUtilisateurs().catch(() => []),
    ]);
    setLocataires(Array.isArray(locataireData) ? locataireData : []);
    setUtilisateurs(Array.isArray(utilisateurData) ? utilisateurData : []);
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(
    () => {
      const source = utilisateurs.length ? utilisateurs : locataires;
      return source.map((item) => {
        const locataire = item.utilisateur ? item : { utilisateur: item };
        const user = locataire.utilisateur || item;
        const roleName =
          user.role?.nom ||
          user.role?.name ||
          (locataire.idUtilisateur ? "Locataire" : "Utilisateur");
        return {
          id: user.idUtilisateur || item.idUtilisateur || item.id,
          prenom: user.prenom || "",
          nom: user.nom || "",
          email: user.email || "",
          role:
            String(roleName).toUpperCase().includes("LOC")
              ? "Locataire"
              : String(roleName).toUpperCase().includes("ADMIN")
              ? "Administrateur"
              : roleName,
          statut: String(user.statut || "ACTIF").toUpperCase(),
          derniereConnexion: user.derniereConnexion || user.dateCreation,
        };
      });
    },
    [locataires, utilisateurs]
  );

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const matchesSearch = `${row.prenom} ${row.nom} ${row.email}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());
        const matchesRole =
          roleFilter === "Tous les rôles" || row.role === roleFilter;
        const matchesStatus =
          statusFilter === "Tous les statuts" ||
          (statusFilter === "Actif" ? row.statut === "ACTIF" : row.statut !== "ACTIF");
        return matchesSearch && matchesRole && matchesStatus;
      }),
    [rows, search, roleFilter, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const formatConnection = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return `${date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    })} - ${date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    if (!form.prenom || !form.nom || !form.email) {
      setMessage("Veuillez renseigner le prénom, le nom et l’adresse e-mail.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const response = await registerLocataire(form);
      setMessage(response?.message || "Compte locataire créé avec succès.");
      setForm(initialForm);
      setInviteOpen(false);
      await load();
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Impossible d’inscrire ce locataire."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = rows.filter((row) => row.statut === "ACTIF").length;
  const pendingCount = rows.filter((row) =>
    ["INACTIF", "INVITE", "EN_ATTENTE", "PENDING"].includes(row.statut)
  ).length;

  if (inviteOpen) {
    return (
      <div className="tenant-registration-page">
        <div className="tenant-registration-header-row">
          <div className="tenant-registration-breadcrumb">
            <span>Gestion locative</span>
            <span className="tenant-registration-separator">/</span>
            <span className="tenant-registration-current">
              Inscription locataire
            </span>
          </div>
        </div>
        <div className="tenant-registration-title-block">
          <h1>Inscrire un locataire</h1>
          <p>Créez son dossier et envoyez-lui un accès temporaire par e-mail.</p>
        </div>
        <div className="tenant-registration-layout">
          <div className="tenant-registration-form-card">
            <div className="tenant-registration-card-title">
              01 Informations du locataire
            </div>
            <form
              onSubmit={handleInvite}
              className="tenant-registration-form"
            >
              <div className="tenant-registration-grid">
                <div className="tenant-form-field">
                  <label htmlFor="prenom">
                    Prénom <span>*</span>
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    value={form.prenom}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        prenom: event.target.value,
                      }))
                    }
                    placeholder="Nadia"
                    required
                  />
                </div>
                <div className="tenant-form-field">
                  <label htmlFor="nom">
                    Nom <span>*</span>
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    value={form.nom}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        nom: event.target.value,
                      }))
                    }
                    placeholder="Coulibaly"
                    required
                  />
                </div>
                <div className="tenant-form-field tenant-form-field-full">
                  <label htmlFor="email">
                    Adresse e-mail <span>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    placeholder="nadia.coulibaly@email.com"
                    required
                  />
                </div>
                <div className="tenant-form-field tenant-form-field-full">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    id="telephone"
                    name="telephone"
                    value={form.telephone}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        telephone: event.target.value,
                      }))
                    }
                    placeholder="+261 34 00 000 00"
                  />
                </div>
                <div className="tenant-form-field tenant-form-field-full">
                  <label htmlFor="adresse">Adresse</label>
                  <input
                    id="adresse"
                    name="adresse"
                    value={form.adresse}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        adresse: event.target.value,
                      }))
                    }
                    placeholder="Rue du Lac, Antananarivo"
                  />
                </div>
                <div className="tenant-form-field tenant-form-field-full">
                  <label htmlFor="pieceIdentite">Pièce d’identité</label>
                  <input
                    id="pieceIdentite"
                    name="pieceIdentite"
                    value={form.pieceIdentite}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        pieceIdentite: event.target.value,
                      }))
                    }
                    placeholder="CNI 12345678"
                  />
                </div>
              </div>
              {message && <div className="tenant-registration-alert">{message}</div>}
              <div className="tenant-registration-actionrow">
                <div className="tenant-registration-required-note">
                  <span>*</span> Champs obligatoires
                </div>
                <div className="tenant-registration-actions">
                  <button
                    type="button"
                    className="tenant-btn-secondary"
                    onClick={() => setInviteOpen(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="tenant-btn-primary"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Envoi..."
                      : "Inscrire et envoyer l’accès"}{" "}
                    <span>→</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <aside className="tenant-registration-side-card">
            <div className="tenant-registration-card-title">
              Un accès, en trois étapes
            </div>
            <ol className="tenant-registration-steps">
              <li>
                <span>1</span>
                <div>
                  <strong>Inscrire le locataire</strong>
                  <p>Enregistrez son nom et son adresse e-mail.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Envoyer les identifiants</strong>
                  <p>Il reçoit un accès temporaire personnel.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Activer son espace</strong>
                  <p>Il choisit son mot de passe définitif.</p>
                </div>
              </li>
            </ol>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      {message && (
        <div className="tenant-registration-alert success">{message}</div>
      )}
      <div className="users-header-row">
        <div>
          <h1>Utilisateurs & accès</h1>
          <p>Des comptes sécurisés, des rôles clairement définis.</p>
        </div>
        <button
          type="button"
          className="invite-btn"
          onClick={() => {
            setForm(initialForm);
            setMessage("");
            setInviteOpen(true);
          }}
        >
          + Inviter un locataire
        </button>
      </div>
      <div className="users-summary-grid">
        <div className="user-summary-card">
          <span>Utilisateurs</span>
          <strong>{rows.length}</strong>
          <small>
            {activeCount} administrateurs • {rows.length - activeCount} locataires
          </small>
        </div>
        <div className="user-summary-card">
          <span>Invitations en attente</span>
          <strong>{pendingCount}</strong>
          <small>Mails de passe temporaire transmis</small>
        </div>
        <div className="user-summary-card">
          <span>Comptes actifs</span>
          <strong>{activeCount}</strong>
          <small>Accès à l’espace personnel</small>
        </div>
      </div>
      <div className="users-toolbar">
        <label className="users-search-wrap">
          <span className="search-icon">⌕</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un nom, un e-mail..."
          />
        </label>
        <div className="users-select-wrap">
          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>Tous les rôles</option>
            <option>Administrateur</option>
            <option>Locataire</option>
          </select>
        </div>
        <div className="users-select-wrap">
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
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
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.length ? (
              visible.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>
                      {row.prenom} {row.nom}
                    </strong>
                  </td>
                  <td>{row.email}</td>
                  <td>
                    <span
                      className={`role-badge ${
                        row.role === "Administrateur" ? "admin" : "tenant"
                      }`}
                    >
                      {row.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        row.statut === "ACTIF" ? "active" : "pending"
                      }`}
                    >
                      {row.statut === "ACTIF" ? "Actif" : "En attente"}
                    </span>
                  </td>
                  <td>{formatConnection(row.derniereConnexion)}</td>
                  <td className="users-actions-col">
                    <button
                      type="button"
                      className="more-btn"
                      aria-label="Actions"
                    >
                      •••
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", height: "220px" }}
                >
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="users-footer">
        <span>
          {filtered.length} utilisateurs affichés - {rows.length} au total
        </span>
        <div className="users-pagination">
          <button
            type="button"
            className="pagination-arrow"
            disabled={page === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) => (
              <button
                type="button"
                key={number}
                className={`page-number ${
                  number === page ? "active" : ""
                }`}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            )
          )}
          <button
            type="button"
            className="pagination-arrow"
            disabled={page === totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocatairesPage;