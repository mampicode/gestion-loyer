import { useEffect, useMemo, useState } from "react";
import { getFoyers } from "../../services/foyerService";
import { getLots, createLot, updateLot, deleteLot } from "../../services/lotService";

const emptyLot = { reference: "", typeLot: "Appartement", superficie: "", loyer: "", statut: "LIBRE", idFoyer: "" };

function Lots() {
  const [lots, setLots] = useState([]);
  const [foyers, setFoyers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tous les statuts");
  const [panel, setPanel] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyLot);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      const [lotData, foyerData] = await Promise.all([getLots().catch(() => []), getFoyers().catch(() => [])]);
      setLots(Array.isArray(lotData) ? lotData : []);
      setFoyers(Array.isArray(foyerData) ? foyerData : []);
    } catch (error) {
      setNotice("Impossible de charger les données du serveur.");
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => lots.filter((lot) => {
    const text = `${lot.reference || lot.numero || ""} ${lot.typeLot || ""} ${lot.foyer?.nom || ""}`.toLowerCase();
    const matchesText = text.includes(search.toLowerCase());
    const matchesStatus = status === "Tous les statuts" || String(lot.statut || "LIBRE").toUpperCase() === status;
    return matchesText && matchesStatus;
  }), [lots, search, status]);

  const openCreate = () => { setEditing(null); setForm(emptyLot); setPanel(true); setNotice(""); };
  const openEdit = (lot) => {
    setEditing(lot);
    setForm({
      reference: lot.reference || lot.numero || "",
      typeLot: lot.typeLot || "Appartement",
      superficie: lot.superficie || lot.surface || "",
      loyer: lot.loyer || lot.loyerBase || "",
      statut: lot.statut || "LIBRE",
      idFoyer: lot.idFoyer || lot.foyer?.idFoyer || "",
    });
    setPanel(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.reference.trim() || !form.idFoyer) {
      setNotice("Sélectionnez un foyer et indiquez une référence.");
      return;
    }
    const payload = { ...form, superficie: Number(form.superficie), loyer: Number(form.loyer), idFoyer: Number(form.idFoyer) };
    try {
      if (editing) await updateLot(editing.idLot, payload); else await createLot(payload);
      setPanel(false); setEditing(null); setForm(emptyLot); setNotice("Lot enregistré avec succès."); await load();
    } catch (error) {
      setNotice("Le lot n’a pas pu être enregistré. Vérifiez le serveur.");
    }
  };

  const remove = async (lot) => {
    if (!window.confirm(`Supprimer le lot ${lot.reference || lot.numero || ""} ?`)) return;
    try { await deleteLot(lot.idLot); setNotice("Lot supprimé avec succès."); await load(); }
    catch (error) { setNotice("Impossible de supprimer ce lot."); }
  };

  return (
    <div className="lots-page">
      <div className="lots-header">
        <div><h1>Lots</h1><p>Gérez les appartements, studios et chambres de vos foyers.</p></div>
        <button type="button" className="lots-primary" onClick={openCreate}>+ Nouveau lot</button>
      </div>

      {notice && <div className="lots-notice" role="status">{notice}</div>}

      <div className="lots-toolbar">
        <div className="lots-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une référence ou un foyer..." /></div>
        <select value={status} onChange={(event) => setStatus(event.target.value)}><option>Tous les statuts</option><option value="LIBRE">LIBRE</option><option value="OCCUPÉ">OCCUPÉ</option><option value="INACTIF">INACTIF</option></select>
      </div>

      <div className="lots-table-card">
        <table className="lots-table">
          <thead><tr><th>Référence</th><th>Foyer</th><th>Type</th><th>Surface</th><th>Loyer</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length ? filtered.map((lot) => (
              <tr key={lot.idLot}><td><strong>{lot.reference || lot.numero || `LOT-${lot.idLot}`}</strong></td><td>{lot.foyer?.nom || foyers.find((foyer) => String(foyer.idFoyer) === String(lot.idFoyer))?.nom || "—"}</td><td>{lot.typeLot || "Appartement"}</td><td>{lot.superficie || lot.surface || 0} m²</td><td>{Number(lot.loyer || lot.loyerBase || 0).toLocaleString("fr-FR")} Ar</td><td><span className={`lot-status ${String(lot.statut || "LIBRE").toLowerCase()}`}>{lot.statut || "LIBRE"}</span></td><td><div className="lots-actions"><button type="button" onClick={() => openEdit(lot)}>Modifier</button><button type="button" className="danger" onClick={() => remove(lot)}>Supprimer</button></div></td></tr>
            )) : <tr><td colSpan="7" className="lots-empty">Aucun lot trouvé.</td></tr>}
          </tbody>
        </table>
      </div>

      {panel && <div className="lots-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPanel(false)}>
        <div className="lots-modal" role="dialog" aria-modal="true" aria-labelledby="lot-modal-title">
          <div className="lots-modal-header"><h2 id="lot-modal-title">{editing ? "Modifier le lot" : "Nouveau lot"}</h2><button type="button" aria-label="Fermer" onClick={() => setPanel(false)}>×</button></div>
          <form onSubmit={submit} className="lots-form">
            <label>Foyer<select value={form.idFoyer} onChange={(event) => setForm({ ...form, idFoyer: event.target.value })}><option value="">Sélectionner un foyer</option>{foyers.map((foyer) => <option key={foyer.idFoyer} value={foyer.idFoyer}>{foyer.nom}</option>)}</select></label>
            <label>Référence<input value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} placeholder="A-101" /></label>
            <div className="lots-form-grid"><label>Type<select value={form.typeLot} onChange={(event) => setForm({ ...form, typeLot: event.target.value })}><option>Appartement</option><option>Studio</option><option>Chambre</option><option>Maison</option></select></label><label>Statut<select value={form.statut} onChange={(event) => setForm({ ...form, statut: event.target.value })}><option>LIBRE</option><option>OCCUPÉ</option><option>INACTIF</option></select></label></div>
            <div className="lots-form-grid"><label>Surface (m²)<input type="number" min="0" value={form.superficie} onChange={(event) => setForm({ ...form, superficie: event.target.value })} /></label><label>Loyer (Ar)<input type="number" min="0" value={form.loyer} onChange={(event) => setForm({ ...form, loyer: event.target.value })} /></label></div>
            <div className="lots-modal-actions"><button type="button" onClick={() => setPanel(false)}>Annuler</button><button type="submit">Enregistrer</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
}

export default Lots;
