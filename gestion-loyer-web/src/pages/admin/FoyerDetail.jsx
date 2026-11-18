import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoyers, deleteFoyer } from "../../services/foyerService";
import { getLots, createLot } from "../../services/lotService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FoyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foyer, setFoyer] = useState(null);
  const [lots, setLots] = useState([]);
  const [filtre, setFiltre] = useState("TOUS");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ reference: "", typeLot: "Appartement", loyer: "" });

  const load = async () => {
    const foyers = await getFoyers();
    setFoyer(foyers.find((x) => x.idFoyer === Number(id)));
    const allLots = await getLots();
    setLots(allLots.filter((l) => l.idFoyer === Number(id) || l.foyer?.idFoyer === Number(id)));
  };

  useEffect(() => { load(); }, [id]);

  const occupes = lots.filter((l) => l.statut === "OCCUPE").length;
  const dispo = lots.length - occupes;
  const occupation = lots.length ? Math.round((occupes / lots.length) * 1000) / 10 : 0;
  const filtered = filtre === "TOUS" ? lots : lots.filter((l) => l.statut !== "OCCUPE");

  const handleCreate = async (e) => {
    e.preventDefault();
    await createLot({ ...form, idFoyer: Number(id), loyer: Number(form.loyer), statut: "DISPONIBLE" });
    setForm({ reference: "", typeLot: "Appartement", loyer: "" });
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    if (window.confirm("Supprimer ce foyer ?")) {
      await deleteFoyer(id);
      navigate("/admin/foyers");
    }
  };

  if (!foyer) return <div style={{ padding: 40 }}>Chargement...</div>;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100%", padding: "8px 0" }}>
      {/* Breadcrumb */}
      <button onClick={() => navigate("/admin/foyers")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, marginBottom: 8 }}>
        ← Foyers et lots
      </button>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{foyer.nom}</h1>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>
            {foyer.typeFoyer} · {foyer.ville}, {foyer.adresse}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 500 }}>
            Modifier
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "#0d9488", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            + Ajouter un lot
          </button>
        </div>
      </div>

      {/* Stats + Map */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px 16px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div><div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{lots.length}</div><div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Lots au total</div></div>
          <div><div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{occupes}</div><div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Lots occupés</div></div>
          <div><div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{dispo}</div><div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Lots disponibles</div></div>
          <div><div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{occupation} %</div><div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Occupation</div></div>
        </div>
        <div style={{ borderRadius: 12, overflow: "hidden", minHeight: 180 }}>
  {foyer.latitude && foyer.longitude ? (
    <MapContainer
      center={[foyer.latitude, foyer.longitude]}
      zoom={15}
      style={{ height: 180, width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[foyer.latitude, foyer.longitude]}>
        <Popup>{foyer.nom}</Popup>
      </Marker>
    </MapContainer>
  ) : (
    <div style={{ background: "#ecfdf5", height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
      Coordonnées non définies
    </div>
  )}
</div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleCreate} style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <input className="input" placeholder="Référence (ex: A-204)" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} required />
          <select className="input" value={form.typeLot} onChange={(e) => setForm({ ...form, typeLot: e.target.value })}>
            <option>Appartement</option><option>Studio</option><option>Chambre</option>
          </select>
          <input className="input" type="number" placeholder="Loyer" value={form.loyer} onChange={(e) => setForm({ ...form, loyer: e.target.value })} />
          <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#0d9488", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Ajouter</button>
        </form>
      )}

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Lots du foyer</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setFiltre("TOUS")} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: filtre === "TOUS" ? "#f0fdfa" : "#f1f5f9", color: filtre === "TOUS" ? "#0d9488" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Tous les lots</button>
            <button onClick={() => setFiltre("DISPO")} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: filtre === "DISPO" ? "#f0fdfa" : "#f1f5f9", color: filtre === "DISPO" ? "#0d9488" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Disponibles · {dispo}</button>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 11, color: "#94a3b8", letterSpacing: "0.5px" }}>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>LOT</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>TYPE</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>LOCATAIRE</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>LOYER / MOIS</th>
              <th style={{ padding: "12px 8px", fontWeight: 600 }}>STATUT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lot) => (
              <tr key={lot.idLot} style={{ borderTop: "1px solid #f1f5f9" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "16px 8px", fontWeight: 600, color: "#0f172a" }}>
  {lot.reference || lot.ref || `Lot #${lot.idLot}`}
</td>
                <td style={{ padding: "16px 8px", color: "#475569" }}>{lot.typeLot}</td>
                <td style={{ padding: "16px 8px", color: "#475569" }}>
  {lot.locataireNom || lot.locataire?.nom || "—"}
</td>
                <td style={{ padding: "16px 8px", color: "#0f172a" }}>
  {lot.loyer?.toLocaleString() || "—"}
</td>
                <td style={{ padding: "16px 8px" }}>
                  <span style={{
                    padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: lot.statut === "OCCUPE" ? "#d1fae5" : "#e0e7ff",
                    color: lot.statut === "OCCUPE" ? "#065f46" : "#4338ca",
                  }}>
                    {lot.statut === "OCCUPE" ? "Occupé" : "Disponible"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>Aucun lot</p>}
      </div>

      {/* Infos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginTop: 16 }}>
        <div />
        <div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 12 }}>
            <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Informations du foyer</h4>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Type de bien</div>
              <div style={{ fontSize: 14, color: "#0f172a" }}>{foyer.typeFoyer}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Coordonnées GPS</div>
              <div style={{ fontSize: 14, color: "#0f172a" }}>{foyer.latitude || "—"}, {foyer.longitude || "—"}</div>
            </div>
          </div>
          <button onClick={handleDelete} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
            Supprimer ce foyer
          </button>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>Suppression possible uniquement sans contrat actif.</p>
        </div>
      </div>
    </div>
  );
}

export default FoyerDetail;