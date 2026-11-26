import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getContratsLocataire } from "../../services/contratService";
import { getReclamationsLocataire, createReclamation } from "../../services/reclamationService";
import { uploadDocument } from "../../services/locataireService";
import "./ReclamationsLocataire.css";

const dateText = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

function ReclamationsLocataire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [reclamations, setReclamations] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [newOpen, setNewOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ typeReclamation: "Plomberie", titre: "", description: "" });

  const load = async () => {
    const idLocataire = user?.id || user?.idUtilisateur;
    const [reclamationData, contratData] = await Promise.all([
      idLocataire ? getReclamationsLocataire(idLocataire).catch(() => []) : Promise.resolve([]),
      idLocataire ? getContratsLocataire(idLocataire).catch(() => []) : Promise.resolve([]),
    ]);
    setReclamations(Array.isArray(reclamationData) ? reclamationData : []);
    setContrats(Array.isArray(contratData) ? contratData : []);
  };

  useEffect(() => { load(); }, [user]);

  const contrat = useMemo(() =>
    contrats.find((item) => String(item.statut || "").toUpperCase() === "EN_COURS") || contrats[0] || null,
  [contrats]);
  const lot = contrat?.lot || {};
  const foyer = lot.foyer || {};
  const logement = `${foyer.nom || "Les Acacias"} • ${lot.numero ? `${lot.typeLot || "Appartement"} ${lot.numero}` : "Appartement A-204"}`;

  const openList = useMemo(() => reclamations.filter((item) => {
    const status = String(item.statut || "OUVERTE").toUpperCase();
    return ["OUVERTE", "NOUVELLE", "EN_COURS", "TRAITE", "TRAITEE"].includes(status);
  }), [reclamations]);

  const resolved = reclamations.filter((item) => ["RESOLUE", "RESOLU", "FERME", "FERMEE", "CLOTURE", "CLOTUREE"].includes(String(item.statut || "").toUpperCase()));
  const latest = reclamations
    .slice()
    .sort((a, b) => new Date(b.dateCreation || 0) - new Date(a.dateCreation || 0))[0];

  const handlePhotos = (event) => {
    const files = Array.from(event.target.files || []);
    const allowed = files.every((file) => ["application/pdf", "image/jpeg", "image/png"].includes(file.type));
    if (!allowed) {
      setMessage("Les photos doivent être au format PDF, JPG ou PNG.");
      event.target.value = "";
      setPhotos([]);
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024) || files.length > 3) {
      setMessage("Vous pouvez joindre jusqu’à 3 fichiers de 5 Mo maximum.");
      event.target.value = "";
      setPhotos([]);
      return;
    }
    setMessage("");
    setPhotos(files);
  };

  const submitReclamation = async (event) => {
    event.preventEvent?.();
    event.preventDefault();
    const idLocataire = user?.id || user?.idUtilisateur;
    if (!idLocataire || !form.titre.trim() || !form.description.trim()) {
      setMessage("Renseignez l’objet et la description de votre demande.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await createReclamation({
        idLocataire,
        lotId: lot.idLot,
        titre: form.titre,
        description: form.description,
        typeReclamation: form.typeReclamation,
        priorite: "MOYENNE",
        statut: "OUVERTE",
      });

      for (const photo of photos) {
        await uploadDocument(idLocataire, "PHOTO_RECLAMATION", photo);
      }

      setNewOpen(false);
      setForm({ typeReclamation: "Plomberie", titre: "", description: "" });
      setPhotos([]);
      setMessage("Votre réclamation a été envoyée au gestionnaire.");
      await load();
    } catch (error) {
      setMessage(error?.response?.data?.message || "La réclamation n’a pas pu être envoyée.");
    } finally {
      setSubmitting(false);
    }
  };

  if (newOpen) {
    return (
      <div className="locataire-reclamation-form-page">
        <button type="button" className="locataire-reclamation-back" onClick={() => setNewOpen(false)}>‹ <span>Mes réclamations</span></button>
        <div className="locataire-reclamation-form-heading"><h1>Signaler un problème</h1><p>Décrivez votre demande pour aider à intervenir efficacement.</p></div>
        {message && <div className="locataire-reclamation-message" role="status">{message}</div>}

        <form onSubmit={submitReclamation} className="locataire-reclamation-form-layout">
          <section className="locataire-reclamation-form-card">
            <h2>Votre demande</h2>
            <div className="locataire-reclamation-form-grid">
              <label>Logement concerné<select value={logement} disabled><option>{logement}</option></select></label>
              <label>Catégorie <span>*</span><select value={form.typeReclamation} onChange={(event) => setForm((previous) => ({ ...previous, typeReclamation: event.target.value }))}><option>Plomberie</option><option>Électricité</option><option>Serrurerie</option><option>Peinture</option><option>Autre</option></select></label>
              <label className="locataire-reclamation-full">Objet de la réclamation <span>*</span><input value={form.titre} onChange={(event) => setForm((previous) => ({ ...previous, titre: event.target.value }))} placeholder="Fuite sous l’évier" required /></label>
              <label className="locataire-reclamation-full">Description du problème <span>*</span><textarea value={form.description} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} placeholder="Bonjour, une fuite est apparue sous l’évier de la cuisine. L’eau s’accumule dans le meuble…" required /></label>
              <div className="locataire-reclamation-upload locataire-reclamation-full">
                <label>Photos (facultatif)</label>
                <button type="button" onClick={() => fileInputRef.current?.click()}><strong>↑</strong> {photos.length ? `${photos.length} fichier(s) sélectionné(s)` : "Ajouter des photos"}</button>
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handlePhotos} hidden />
                <small>JPG, PNG ou PDF · 3 photos maximum</small>
              </div>
            </div>
            <p className="locataire-reclamation-hint">Cette déclaration ne déclenche pas directement d’intervention.<br />Modes de suivi : Nouveau • En cours • Résolu</p>
          </section>

          <aside className="locataire-reclamation-help">
            <h2>Une demande bien décrite</h2>
            <ol><li><span>01</span><p>Précisez la pièce concernée.</p></li><li><span>02</span><p>Décrivez depuis quand le problème existe.</p></li><li><span>03</span><p>Ajoutez une photo si possible.</p></li></ol>
            <div><strong>Et après l’envoi ?</strong><p>Retrouvez le statut de votre demande dans « Mes réclamations » puis nouveau, en cours ou résolu.</p></div>
          </aside>

          <div className="locataire-reclamation-actions"><button type="button" onClick={() => setNewOpen(false)}>Annuler</button><button type="submit" disabled={submitting}>{submitting ? "Envoi…" : "Envoyer la réclamation"} {!submitting && <span>→</span>}</button></div>
        </form>
      </div>
    );
  }

  const latestStatus = String(latest?.statut || "OUVERTE").toUpperCase();
  const latestLabel = latestStatus === "RESOLUE" || latestStatus === "RESOLU" ? "Résolu" : latestStatus === "EN_COURS" ? "Pris en charge" : "Nouveau";
  const latestStep = latestLabel === "Résolu" ? 2 : latestLabel === "Pris en charge" ? 1 : 0;

  return (
    <div className="locataire-reclamations-page">
      <div className="locataire-reclamations-heading"><div><h1>Mes réclamations</h1><p>Signalez un problème et suivez son traitement, étape par étape.</p></div><button type="button" onClick={() => { setMessage(""); setNewOpen(true); }}>+ Signaler un problème</button></div>

      {message && <div className="locataire-reclamation-message" role="status">{message}</div>}

      <div className="locataire-reclamation-tabs"><button type="button" className="active">Toutes · {reclamations.length}</button><button type="button">Ouvertes · {openList.length}</button><button type="button">Résolues · {resolved.length}</button></div>

      {latest ? (
        <section className="locataire-reclamation-feature">
          <span className="locataire-reclamation-status-tag">{latestLabel}</span>
          <div className="locataire-reclamation-feature-date">REC-{String(latest.idReclamation || "").padStart(3, "0")} · {dateText(latest.dateCreation)}</div>
          <h2>{latest.titre}</h2>
          <p>{latest.typeReclamation || "Plomberie"} · {logement}</p>
          <div className="locataire-reclamation-description">{latest.description}</div>
          <div className="locataire-reclamation-progress"><div className="locataire-reclamation-line"><i className="done" /><i className={latestStep >= 1 ? "done" : ""} /><i className={latestStep >= 2 ? "done" : ""} /></div><div className="locataire-reclamation-labels"><span>Signalé</span><span>Prise en charge</span><span>Résolu</span></div></div>
        </section>
      ) : <section className="locataire-reclamation-feature locataire-reclamation-empty"><h2>Aucune demande pour le moment</h2><p>Vous pouvez signaler un problème depuis le bouton ci-dessus.</p></section>}

      <section className="locataire-reclamation-history"><h2>Historique des demandes</h2>{reclamations.slice().sort((a, b) => new Date(b.dateCreation || 0) - new Date(a.dateCreation || 0)).map((item) => {
        const status = String(item.statut || "OUVERTE").toUpperCase();
        const label = ["RESOLUE", "RESOLU", "FERME", "FERMEE", "CLOTURE", "CLOTUREE"].includes(status) ? "Résolu" : status === "EN_COURS" ? "En cours" : "Nouveau";
        return <article key={item.idReclamation}><div><span>REC-{String(item.idReclamation || "").padStart(3, "0")} · {dateText(item.dateCreation)}</span><h3>{item.titre}</h3></div><div className="locataire-reclamation-resolution"><span>{label === "Résolu" ? `Résolu le ${dateText(item.dateResolution)}` : label}</span><button type="button" className={label === "Résolu" ? "resolved" : ""}>{label === "Résolu" ? "Résolu" : "Voir"}</button></div></article>;
      })}</section>
    </div>
  );
}

export default ReclamationsLocataire;
