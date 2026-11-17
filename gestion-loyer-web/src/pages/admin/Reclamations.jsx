import { useEffect, useMemo, useState } from "react";
import { getReclamations, updateReclamationStatut } from "../../services/reclamationService";

const initialClaims = [];

const statusClassMap = {
  Nouveau: "status-new",
  "En cours": "status-progress",
  Résolu: "status-done",
  OUVERT: "status-new",
  EN_COURS: "status-progress",
  RESOLUE: "status-done",
};

const priorityClassMap = {
  "Priorité haute": "priority-high",
  "Priorité moyenne": "priority-medium",
  "Priorité faible": "priority-low",
  HAUTE: "priority-high",
  MOYENNE: "priority-medium",
  FAIBLE: "priority-low",
};

const normalizeStatus = (status) => {
  if (!status) return "Nouveau";
  const value = String(status).toUpperCase();
  if (value.includes("RESOL")) return "Résolu";
  if (value.includes("EN_COURS") || value.includes("COURS")) return "En cours";
  return "Nouveau";
};

const normalizePriority = (priority) => {
  if (!priority) return "Priorité moyenne";
  const value = String(priority).toUpperCase();
  if (value.includes("HAUT")) return "Priorité haute";
  if (value.includes("FAIB")) return "Priorité faible";
  return "Priorité moyenne";
};

function Reclamations() {
  const [rows, setRows] = useState(initialClaims);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("Toutes");
  const [priority, setPriority] = useState("Toutes");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReclamations();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.idReclamation || item.id || `REC-${Math.random().toString().slice(2, 8)}`,
            titre: item.titre || "Réclamation",
            locataire: item.locataire?.utilisateur
              ? `${item.locataire.utilisateur.prenom || ""} ${item.locataire.utilisateur.nom || ""}`.trim()
              : item.locataire?.nom || "Locataire",
            lot: item.lot?.numero || item.lot?.reference || item.lot?.idLot || "Lot",
            description: item.description || "Aucune description fournie.",
            date: item.dateCreation ? new Date(item.dateCreation).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "Date inconnue",
            statut: normalizeStatus(item.statut),
            priorite: normalizePriority(item.priorite),
            historique: [
              {
                label: "Réclamation reçue",
                date: item.dateCreation ? new Date(item.dateCreation).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "Date inconnue",
                auteur: "Locataire",
              },
            ],
            note: item.note || "",
          }));
          setRows(mapped);
          setSelectedId(mapped[0]?.id ?? null);
        }
      } catch (error) {
        console.warn("Réclamations backend indisponible, affichage vide.", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesFilter = filter === "Toutes" || row.statut === filter;
      const matchesPriority = priority === "Toutes" || row.priorite === priority;
      return matchesFilter && matchesPriority;
    });
  }, [rows, filter, priority]);

  const selectedRow = useMemo(
    () => filteredRows.find((row) => row.id === selectedId) || rows.find((row) => row.id === selectedId) || rows[0],
    [filteredRows, rows, selectedId]
  );

  const handleSelect = (id) => setSelectedId(id);

  const handleStatusChange = async (nextStatus) => {
    if (!selectedRow) return;

    try {
      await updateReclamationStatut(selectedRow.id, nextStatus === "Résolu" ? "RESOLUE" : nextStatus === "En cours" ? "EN_COURS" : "OUVERTE");
    } catch (error) {
      console.warn("Impossible de mettre à jour le statut côté API", error);
    }

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === selectedRow.id
          ? {
              ...row,
              statut: nextStatus,
              historique: [
                ...row.historique,
                { label: nextStatus === "Résolu" ? "Réclamation résolue" : "Prise en charge", date: "Aujourd’hui", auteur: "Support" },
              ],
            }
          : row
      )
    );
  };

  const handleAddNote = () => {
    if (!note.trim() || !selectedRow) return;

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === selectedRow.id
          ? {
              ...row,
              historique: [...row.historique, { label: "Note interne", date: "Aujourd’hui", auteur: "Support" }],
              note: note.trim(),
            }
          : row
      )
    );

    setNote("");
  };

  return (
    <div className="reclamations-page">
      <div className="reclamations-breadcrumb">
        <span>Gestion locative</span>
        <span className="reclam-breadcrumb-separator">/</span>
        <span className="reclam-current">Réclamations</span>
      </div>

      <div className="reclamations-header-row">
        <div>
          <h1>Réclamations</h1>
          <p>Un suivi transparent, du signalement à la résolution.</p>
        </div>

        <div className="reclam-pill-group">
          <span className="reclam-tab-pill open">{rows.filter((r) => normalizeStatus(r.statut) !== "Résolu").length} ouvertes</span>
          <span className="reclam-tab-pill progress">{rows.filter((r) => normalizeStatus(r.statut) === "En cours").length} en cours</span>
          <span className="reclam-tab-pill solved">{rows.filter((r) => normalizeStatus(r.statut) === "Résolu").length} résolues</span>
        </div>
      </div>

      <div className="reclamations-main-layout">
        <aside className="reclamation-list-panel">
          <div className="list-filters">
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option>Toutes</option>
              <option>Nouveau</option>
              <option>En cours</option>
              <option>Résolu</option>
            </select>

            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option>Toutes</option>
              <option>Priorité haute</option>
              <option>Priorité moyenne</option>
              <option>Priorité faible</option>
            </select>
          </div>

          <div className="reclamation-list-items">
            {loading ? (
              <div className="empty-detail">Chargement...</div>
            ) : filteredRows.length === 0 ? (
              <div className="empty-detail">Aucune réclamation trouvée.</div>
            ) : (
              filteredRows.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  className={`reclamation-list-item ${selectedRow?.id === row.id ? "selected" : ""}`}
                  onClick={() => handleSelect(row.id)}
                >
                  <div className="list-item-header">
                    <span className="list-ref">{row.id}</span>
                    <span className={`mini-status ${statusClassMap[row.statut] || "status-new"}`}>{row.statut}</span>
                  </div>

                  <h3>{row.titre}</h3>
                  <p>
                    {row.locataire} • {row.lot}
                  </p>
                  <div className="list-item-footer">
                    <span className={`mini-priority ${priorityClassMap[row.priorite] || "priority-medium"}`}>{row.priorite}</span>
                    <time>{row.date}</time>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="list-summary">{filteredRows.length} réclamations affichées</div>
        </aside>

        <section className="reclamation-detail-panel">
          {selectedRow ? (
            <>
              <div className="detail-topbar">
                <span className="detail-ref">{selectedRow.id}</span>
                <span className={`detail-status ${statusClassMap[selectedRow.statut] || "status-new"}`}>{selectedRow.statut}</span>
              </div>

              <h2>{selectedRow.titre}</h2>

              <div className="detail-meta">
                <div className="meta-line">
                  <span className="meta-label">Locataire</span>
                  <strong>{selectedRow.locataire}</strong>
                </div>
                <div className="meta-line">
                  <span className="meta-label">Logement</span>
                  <strong>
                    {selectedRow.locataire} • {selectedRow.lot}
                  </strong>
                </div>
              </div>

              <div className="detail-section">
                <h3>Description du problème</h3>
                <p>{selectedRow.description}</p>
              </div>

              <div className="detail-section">
                <h3>Historique de traitement</h3>
                <div className="timeline">
                  {selectedRow.historique.map((item, index) => (
                    <div key={`${item.label}-${index}`} className="timeline-item">
                      <span className="timeline-dot" />
                      <div>
                        <strong>{item.label}</strong>
                        <div className="timeline-meta">
                          {item.date} • {item.auteur}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <label className="note-label" htmlFor="claim-note">
                  Note interne
                </label>
                <textarea
                  id="claim-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Ajouter une note pour le support..."
                />
              </div>

              <div className="detail-actions">
                <button type="button" className="primary-action" onClick={() => handleStatusChange("En cours")}>
                  Prendre en charge
                </button>
                <button type="button" className="secondary-action" onClick={handleAddNote}>
                  Ajouter une note
                </button>
                <button type="button" className="secondary-action" onClick={() => handleStatusChange("Résolu")}>
                  Marquer comme résolu
                </button>
              </div>
            </>
          ) : (
            <div className="empty-detail">Aucune réclamation sélectionnée.</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Reclamations;