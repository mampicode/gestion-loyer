import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createFoyer, getFoyers, updateFoyer, deleteFoyer } from "../../services/foyerService";
import MapPicker from "../../components/MapPicker";
import AddressAutocomplete from "../../components/AddressAutocomplete";

function FoyerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [position, setPosition] = useState([5.3599, -3.9870]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [showLotDraft, setShowLotDraft] = useState(false);
  const [lotDraft, setLotDraft] = useState({ reference: "", typeLot: "Appartement", superficie: "", loyer: "" });

  const [form, setForm] = useState({
    nom: "",
    typeFoyer: "Immeuble",
    adresse: "",
    ville: "Abidjan",
    quartier: "",
    latitude: "5.3599",
    longitude: "-3.9870",
    description: "",
    statut: "ACTIF",
  });

  useEffect(() => {
    if (!isEdit) return;
    getFoyers().then((data) => {
      const foyer = data.find((item) => String(item.idFoyer) === String(id));
      if (!foyer) return;
      const next = {
        ...foyer,
        latitude: foyer.latitude ?? "5.3599",
        longitude: foyer.longitude ?? "-3.9870",
      };
      setForm(next);
      setPosition([Number(next.latitude), Number(next.longitude)]);
    }).catch(() => setNotice("Impossible de charger les informations du foyer."));
  }, [id, isEdit]);

  useEffect(() => {
    if (!position?.length) return;
    setForm((current) => ({
      ...current,
      latitude: Number(position[0]).toFixed(5),
      longitude: Number(position[1]).toFixed(5),
    }));
  }, [position]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.nom.trim()) nextErrors.nom = "Indiquez le nom du foyer.";
    if (!form.ville.trim()) nextErrors.ville = "Indiquez la ville.";
    if (!form.quartier.trim()) nextErrors.quartier = "Indiquez le quartier.";
    if (!form.adresse.trim()) nextErrors.adresse = "Indiquez l’adresse complète.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      setNotice("Veuillez corriger les champs obligatoires.");
      return;
    }

    setSubmitting(true);
    setNotice("");
    const payload = { ...form, latitude: position[0], longitude: position[1] };

    try {
      const saved = isEdit ? await updateFoyer(id, payload) : await createFoyer(payload);
      if (!isEdit && lotDraft.reference.trim()) {
        localStorage.setItem("pendingLotDraft", JSON.stringify({ ...lotDraft, foyerId: saved.idFoyer, foyerName: saved.nom }));
      }
      navigate("/admin/foyers", { state: { notice: isEdit ? "Foyer modifié avec succès." : "Foyer créé avec succès." } });
    } catch (error) {
      setNotice("Impossible d’enregistrer le foyer. Vérifiez la connexion au serveur puis réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce foyer ?")) return;
    try {
      await deleteFoyer(id);
      navigate("/admin/foyers", { state: { notice: "Foyer supprimé avec succès." } });
    } catch (error) {
      setNotice("Impossible de supprimer ce foyer.");
    }
  };

  return (
    <form className="foyer-form-page" onSubmit={handleSubmit} noValidate>
      <div className="foyer-form-breadcrumb">
        <span>Gestion locative</span><span className="breadcrumb-separator">/</span>
        <strong>{isEdit ? "Modifier le foyer" : "Nouveau foyer"}</strong>
      </div>

      <button type="button" className="foyer-back-link" onClick={() => navigate("/admin/foyers")}>← Retour aux foyers</button>

      <div className="foyer-form-header">
        <h1>{isEdit ? "Modifier le foyer" : "Nouveau foyer"}</h1>
        <p>Ajoutez une résidence, puis définissez les lots qui la composent.</p>
      </div>

      {notice && <div className="foyer-form-alert" role="alert">{notice}</div>}

      <div className="foyer-form-main-layout">
        <section className="foyer-form-card">
          <div className="form-section-title"><span>01</span> Informations générales</div>
          <div className="form-grid">
            <div className="field-block full">
              <label htmlFor="nom">Nom du foyer <span className="required">*</span></label>
              <input id="nom" className={`foyer-input ${errors.nom ? "field-error" : ""}`} name="nom" value={form.nom} onChange={handleChange} placeholder="Résidence Les Jardins" />
              {errors.nom && <small className="field-message">{errors.nom}</small>}
            </div>

            <div className="field-block full type-block">
              <label>Type de bien <span className="required">*</span></label>
              <div className="segmented-group">
                {["Immeuble", "Maison"].map((type) => (
                  <button key={type} type="button" className={form.typeFoyer === type ? "segment active" : "segment"} onClick={() => setForm((current) => ({ ...current, typeFoyer: type }))}>
                    <span className="segment-dot" />{type}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-block split-left">
              <label htmlFor="ville">Ville <span className="required">*</span></label>
              <input id="ville" className={`foyer-input ${errors.ville ? "field-error" : ""}`} name="ville" value={form.ville} onChange={handleChange} placeholder="Abidjan" />
              {errors.ville && <small className="field-message">{errors.ville}</small>}
            </div>

            <div className="field-block split-right">
              <label htmlFor="quartier">Quartier <span className="required">*</span></label>
              <input id="quartier" className={`foyer-input ${errors.quartier ? "field-error" : ""}`} name="quartier" value={form.quartier} onChange={handleChange} placeholder="Cocody" />
              {errors.quartier && <small className="field-message">{errors.quartier}</small>}
            </div>

            <div className="field-block full">
              <label htmlFor="adresse">Adresse complète <span className="required">*</span></label>
              <AddressAutocomplete value={form.adresse} onChange={(value) => { setForm((current) => ({ ...current, adresse: value })); setErrors((current) => ({ ...current, adresse: "" })); }} placeholder="Boulevard des Jardins, rue 24" />
              {errors.adresse && <small className="field-message">{errors.adresse}</small>}
            </div>

            <div className="field-block split-left">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" className="foyer-input" name="latitude" value={form.latitude} onChange={(event) => { handleChange(event); setPosition([Number(event.target.value) || position[0], position[1]]); }} />
            </div>

            <div className="field-block split-right">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" className="foyer-input" name="longitude" value={form.longitude} onChange={(event) => { handleChange(event); setPosition([position[0], Number(event.target.value) || position[1]]); }} />
            </div>
          </div>
          <div className="mandatory-note"><span>*</span> Champs obligatoires</div>
        </section>

        <aside className="foyer-side-panel">
          <div className="side-panel-box location-card">
            <div className="side-panel-title"><span>02</span> Localisation</div>
            <div className="foyer-map-picker"><MapPicker position={position} setPosition={setPosition} /></div>
          </div>

          <div className="side-panel-box compact-box">
            <div className="side-panel-title"><span>03</span> Lots rattachés</div>
            {!showLotDraft ? (
              <>
                <p>Créez les appartements, studios ou chambres après l’enregistrement du foyer.</p>
                <button type="button" className="foyer-lot-button" onClick={() => setShowLotDraft(true)}>+ Préparer un premier lot</button>
              </>
            ) : (
              <div className="lot-draft-form">
                <input aria-label="Référence du lot" className="foyer-input" value={lotDraft.reference} onChange={(event) => setLotDraft({ ...lotDraft, reference: event.target.value })} placeholder="Référence (ex. A-101)" />
                <select aria-label="Type de lot" className="foyer-input" value={lotDraft.typeLot} onChange={(event) => setLotDraft({ ...lotDraft, typeLot: event.target.value })}><option>Appartement</option><option>Studio</option><option>Chambre</option><option>Maison</option></select>
                <div className="lot-draft-row">
                  <input aria-label="Superficie" type="number" className="foyer-input" value={lotDraft.superficie} onChange={(event) => setLotDraft({ ...lotDraft, superficie: event.target.value })} placeholder="m²" />
                  <input aria-label="Loyer" type="number" className="foyer-input" value={lotDraft.loyer} onChange={(event) => setLotDraft({ ...lotDraft, loyer: event.target.value })} placeholder="Loyer" />
                </div>
                <button type="button" className="foyer-lot-cancel" onClick={() => setShowLotDraft(false)}>Annuler le lot</button>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="foyer-form-footer">
        {isEdit && <button type="button" className="delete-btn" onClick={handleDelete}>Supprimer</button>}
        <div className="foyer-form-footer-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/foyers")}>Annuler</button>
          <button type="submit" className="confirm-btn" disabled={submitting}>{submitting ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer le foyer →"}</button>
        </div>
      </div>
    </form>
  );
}

export default FoyerForm;