import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createFoyer, getFoyers, updateFoyer, deleteFoyer } from "../../services/foyerService";

function FoyerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [position, setPosition] = useState([5.3599, -3.9870]);

  const [form, setForm] = useState({
    nom: "Résidence Les Jardins",
    typeFoyer: "Immeuble",
    adresse: "Boulevard des Jardins, rue 24",
    ville: "Abidjan",
    quartier: "Cocody",
    latitude: "5.3599",
    longitude: "-3.9870",
    description: "",
    statut: "ACTIF",
  });

  useEffect(() => {
    if (isEdit) {
      getFoyers().then((data) => {
        const foyer = data.find((f) => f.idFoyer === Number(id));
        if (foyer) {
          setForm({
            ...foyer,
            latitude: foyer.latitude ?? "5.3599",
            longitude: foyer.longitude ?? "-3.9870",
          });
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      latitude: position?.[0] ?? form.latitude,
      longitude: position?.[1] ?? form.longitude,
    };

    if (isEdit) {
      await updateFoyer(id, data);
    } else {
      await createFoyer(data);
    }
    navigate("/admin/foyers");
  };

  const handleDelete = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce foyer ?")) {
      try {
        await deleteFoyer(id);
        navigate("/admin/foyers");
      } catch (error) {
        // ignore
      }
    }
  };

  return (
    <div className="foyer-form-page">
      <div className="foyer-form-breadcrumb">
        <span>Gestion locative</span>
        <span className="breadcrumb-separator">/</span>
        <span className="current-page">Nouveau foyer</span>
      </div>

      <div className="foyer-form-back-row">
        <button type="button" className="foyer-back-link" onClick={() => navigate("/admin/foyers")}>
          ← Retour aux foyers
        </button>
      </div>

      <div className="foyer-form-header">
        <h1>Nouveau foyer</h1>
        <p>Ajoutez une résidence, puis définissez les lots qui la composent.</p>
      </div>

      <div className="foyer-form-main-layout">
        <section className="foyer-form-card">
          <div className="form-section-title">01  Informations générales</div>

          <div className="form-grid">
            <div className="field-block full">
              <label>Nom du foyer <span className="required">*</span></label>
              <input
                className="foyer-input"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Résidence Les Jardins"
              />
            </div>

            <div className="field-block full type-block">
              <label>Type de bien <span className="required">*</span></label>
              <div className="segmented-group">
                <button
                  type="button"
                  className={form.typeFoyer === "Immeuble" ? "segment active" : "segment"}
                  onClick={() => setForm({ ...form, typeFoyer: "Immeuble" })}
                >
                  <span className="segment-dot" />
                  Immeuble
                </button>
                <button
                  type="button"
                  className={form.typeFoyer === "Maison" ? "segment active" : "segment"}
                  onClick={() => setForm({ ...form, typeFoyer: "Maison" })}
                >
                  <span className="segment-dot" />
                  Maison
                </button>
              </div>
            </div>

            <div className="field-block split-left">
              <label>Ville <span className="required">*</span></label>
              <input
                className="foyer-input"
                name="ville"
                value={form.ville}
                onChange={handleChange}
                placeholder="Abidjan"
              />
            </div>

            <div className="field-block split-right">
              <label>Quartier <span className="required">*</span></label>
              <input
                className="foyer-input"
                name="quartier"
                value={form.quartier}
                onChange={handleChange}
                placeholder="Cocody"
              />
            </div>

            <div className="field-block full">
              <label>Adresse complète <span className="required">*</span></label>
              <input
                className="foyer-input"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                placeholder="Boulevard des Jardins, rue 24"
              />
            </div>

            <div className="field-block split-left">
              <label>Latitude</label>
              <input
                className="foyer-input"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="5.3599"
              />
            </div>

            <div className="field-block split-right">
              <label>Longitude</label>
              <input
                className="foyer-input"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="-3.9870"
              />
            </div>
          </div>

          <div className="mandatory-note">* Champs obligatoires</div>
        </section>

        <aside className="foyer-side-panel">
          <div className="side-panel-box">
            <div className="side-panel-title">02  Localisation</div>

            <div className="mini-map" aria-label="Carte de localisation">
              <span className="mini-road road-one" />
              <span className="mini-road road-two" />
              <span className="mini-road road-three" />
              <span className="mini-pin" />
            </div>

            <div className="location-labels">
              <div className="location-chip">COCODY</div>
              <div className="location-name">Les Acacias</div>
              <div className="location-sub">Bd des Jardins</div>
              <div className="location-sub muted">Localisation indicative</div>
            </div>
          </div>

          <div className="side-panel-box compact-box">
            <div className="side-panel-title">03  Lots rattachés</div>
            <p>
              Créez les appartements, studios ou chambres après l’enregistrement du foyer.
            </p>
            <button type="button" className="foyer-lot-button">
              + Préparer un premier lot
            </button>
          </div>
        </aside>
      </div>

      <div className="foyer-form-footer">
        <button type="button" className="cancel-btn" onClick={() => navigate("/admin/foyers")}>
          Annuler
        </button>
        <button type="button" className="confirm-btn" onClick={handleSubmit}>
          Créer le foyer →
        </button>
      </div>
    </div>
  );
}

export default FoyerForm;