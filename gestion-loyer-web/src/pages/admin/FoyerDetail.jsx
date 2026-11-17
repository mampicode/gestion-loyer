import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoyers, updateFoyer } from "../../services/foyerService";
import { getLots, createLot, deleteLot, updateLot } from "../../services/lotService";

function FoyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foyer, setFoyer] = useState(null);
  const [lots, setLots] = useState([]);
  const [editForm, setEditForm] = useState({});
  const [showLotPanel, setShowLotPanel] = useState(false);
  const [lotForm, setLotForm] = useState({
    reference: "",
    typeLot: "Appartement",
    superficie: "",
    loyer: "",
  });
  const [editingLot, setEditingLot] = useState(null);

  const load = async () => {
    const foyers = await getFoyers();
    const f = foyers.find((x) => x.idFoyer === Number(id));
    setFoyer(f);
    setEditForm(f || {});

    const allLots = await getLots();
    setLots(allLots.filter((l) => l.idFoyer === Number(id) || l.foyer?.idFoyer === Number(id)));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleLotChange = (e) => setLotForm({ ...lotForm, [e.target.name]: e.target.value });

  const handleUpdateFoyer = async (e) => {
    e.preventDefault();
    await updateFoyer(id, editForm);
    load();
  };

  const handleCreateOrUpdateLot = async (e) => {
    e.preventDefault();
    const data = {
      ...lotForm,
      idFoyer: Number(id),
      superficie: Number(lotForm.superficie),
      loyer: Number(lotForm.loyer),
    };
    if (editingLot) {
      await updateLot(editingLot.idLot, data);
    } else {
      await createLot(data);
    }
    setLotForm({ reference: "", typeLot: "Appartement", superficie: "", loyer: "" });
    setEditingLot(null);
    setShowLotPanel(false);
    load();
  };

  const handleEditLot = (lot) => {
    setEditingLot(lot);
    setLotForm({
      reference: lot.reference || "",
      typeLot: lot.typeLot || "Appartement",
      superficie: lot.superficie || "",
      loyer: lot.loyer || "",
    });
    setShowLotPanel(true);
  };

  const handleDeleteLot = async (idLot) => {
    if (window.confirm("Supprimer ce lot ?")) {
      await deleteLot(idLot);
      load();
    }
  };

  if (!foyer) return <p>Chargement...</p>;

  const stats = [
    { label: "Lots", value: Number(foyer.lots ?? lots.length ?? 24), suffix: " unités" },
    { label: "Occupés", value: foyer.occupes ?? 22, suffix: " / 24" },
    { label: "Loyer mensuel", value: Number(foyer.loyerMensuel ?? foyer.loyer ?? 0).toLocaleString("fr-FR"), suffix: " Ar" },
    { label: "Impayés", value: "1 240 000", suffix: " Ar" },
  ];

  return (
    <div className="foyer-detail-page">
      <div className="foyer-detail-header">
        <div className="foyer-breadcrumb">
          <span>Gestion locative</span>
          <span className="crumb-separator">/</span>
          <span>Foyers &amp; lots</span>
          <span className="crumb-separator">/</span>
          <strong>{foyer.nom}</strong>
        </div>

        <div className="foyer-detail-actions">
          <button type="button" className="ghost-btn" onClick={() => navigate("/admin/foyers")}>
            ← Retour
          </button>
          <button type="button" className="primary-btn" onClick={() => setShowLotPanel(!showLotPanel)}>
            {showLotPanel ? "Fermer" : "Ajouter un lot"}
          </button>
        </div>
      </div>

      <div className="foyer-title-row">
        <div>
          <div className="detail-kicker">Foyer</div>
          <h1>{foyer.nom}</h1>
          <p>{foyer.adresse || `${foyer.ville || "Abidjan"} · ${foyer.quartier || "Adjiban"}`}</p>
        </div>

        <div className="status-tag">Actif</div>
      </div>

      <div className="foyer-stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="foyer-stat-card">
            <span>{stat.label}</span>
            <strong>
              {stat.value}
              {stat.suffix && <small>{stat.suffix}</small>}
            </strong>
          </div>
        ))}
      </div>

      <div className="foyer-detail-layout">
        <section className="foyer-main-panel">
          <div className="section-head">
            <h2>Lots du foyer</h2>
            <button type="button" className="inline-link" onClick={() => setShowLotPanel(true)}>
              Ajouter un lot
            </button>
          </div>

          <div className="lot-table-wrapper">
            <table className="lot-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Type</th>
                  <th>Surface</th>
                  <th>Loyer</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {lots.length > 0 ? (
                  lots.map((lot) => (
                    <tr key={lot.idLot ?? `${lot.reference}-${lot.typeLot}`}>
                      <td>{lot.reference || `LOT-${lot.idLot ?? "000"}`}</td>
                      <td>{lot.typeLot || "Appartement"}</td>
                      <td>{lot.superficie ?? 42} m²</td>
                      <td>{Number(lot.loyer ?? 0).toLocaleString("fr-FR")} Ar</td>
                      <td>
                        <span className="lot-status available">Disponible</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="action-btn" onClick={() => handleEditLot(lot)}>
                            Modifier
                          </button>
                          <button type="button" className="action-btn danger" onClick={() => handleDeleteLot(lot.idLot)}>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">Aucun lot enregistré pour ce foyer.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="foyer-side-column">
          <div className="mini-map-card">
            <div className="mini-map-header">
              <span>Localisation</span>
              <button type="button" className="mini-tag">Carte</button>
            </div>

            <div className="map-illustration" aria-label="Carte de localisation">
              <span className="map-road road-1" />
              <span className="map-road road-2" />
              <span className="map-road road-3" />
              <span className="map-pin" />
            </div>

            <div className="map-address-box">
              <strong>{foyer.nom}</strong>
              <p>{foyer.adresse || "Zone résidentielle, Cocody"}</p>
            </div>
          </div>

          <div className="info-card">
            <h3>Informations</h3>

            <div className="info-row">
              <span>Type</span>
              <strong>{foyer.typeFoyer || "Immeuble"}</strong>
            </div>
            <div className="info-row">
              <span>Ville</span>
              <strong>{foyer.ville || "Cocody"}</strong>
            </div>
            <div className="info-row">
              <span>Quartier</span>
              <strong>{foyer.quartier || "Adjiban"}</strong>
            </div>
            <div className="info-row">
              <span>Nombre de lots</span>
              <strong>{lots.length || foyer.lots || 24}</strong>
            </div>
          </div>

          <form onSubmit={handleUpdateFoyer} className="foyer-edit-card">
            <h3>Modifier le foyer</h3>
            <input className="input" name="nom" value={editForm.nom || ""} onChange={handleEditChange} placeholder="Nom" />
            <input className="input" name="adresse" value={editForm.adresse || ""} onChange={handleEditChange} placeholder="Adresse" />
            <input className="input" name="ville" value={editForm.ville || ""} onChange={handleEditChange} placeholder="Ville" />
            <input className="input" name="quartier" value={editForm.quartier || ""} onChange={handleEditChange} placeholder="Quartier" />
            <button type="submit" className="primary-btn full-width">Enregistrer</button>
          </form>
        </aside>
      </div>

      {showLotPanel && (
        <div className="lot-floating-panel">
          <div className="lot-floating-panel__header">
            <h3>{editingLot ? "Modifier le lot" : "Nouveau lot"}</h3>
            <button type="button" className="close-panel" onClick={() => setShowLotPanel(false)} aria-label="Fermer">
              ×
            </button>
          </div>

          <form onSubmit={handleCreateOrUpdateLot} className="lot-form">
            <div className="field-grid">
              <input className="input" name="reference" placeholder="Référence" value={lotForm.reference} onChange={handleLotChange} required />
              <select className="input" name="typeLot" value={lotForm.typeLot} onChange={handleLotChange}>
                <option value="Appartement">Appartement</option>
                <option value="Studio">Studio</option>
                <option value="Chambre">Chambre</option>
              </select>
              <input className="input" type="number" name="superficie" placeholder="Superficie (m²)" value={lotForm.superficie} onChange={handleLotChange} />
              <input className="input" type="number" name="loyer" placeholder="Loyer (Ar)" value={lotForm.loyer} onChange={handleLotChange} />
            </div>

            <div className="lot-form-actions">
              <button type="button" className="ghost-btn" onClick={() => setShowLotPanel(false)}>
                Annuler
              </button>
              <button type="submit" className="primary-btn">
                {editingLot ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default FoyerDetail;