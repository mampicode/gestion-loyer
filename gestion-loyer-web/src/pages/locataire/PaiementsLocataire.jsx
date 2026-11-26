import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getContratsLocataire } from "../../services/contratService";
import { getPaiementsContrat, getImpayesEnCours, createPaiement } from "../../services/paiementService";
import { useNavigate } from "react-router-dom";
import "./PaiementsLocataire.css";

const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} Ar`;

const dateText = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

function PaiementsLocataire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contrats, setContrats] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [impayes, setImpayes] = useState([]);
  const [annee, setAnnee] = useState(String(new Date().getFullYear()));
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ periode: "Novembre 2026", montant: "", datePaiement: new Date().toISOString().slice(0, 10), modePaiement: "MOBILE_MONEY", reference: "" });
  const pageSize = 6;

  const load = async () => {
    const idLocataire = user?.id || user?.idUtilisateur;
    const contratData = idLocataire ? await getContratsLocataire(idLocataire).catch(() => []) : [];
    const list = Array.isArray(contratData) ? contratData : [];
    setContrats(list);

    const contratActif = list.find((item) => String(item.statut || "").toUpperCase() === "EN_COURS") || list[0];
    const idContrat = contratActif?.idContrat;

    const [paiementData, impayeData] = await Promise.all([
      idContrat ? getPaiementsContrat(idContrat).catch(() => []) : Promise.resolve([]),
      getImpayesEnCours().catch(() => []),
    ]);
    setPaiements(Array.isArray(paiementData) ? paiementData : []);
    setImpayes(Array.isArray(impayeData) ? impayeData : []);
  };

  useEffect(() => { load(); }, [user]);

  const contrat = useMemo(() => contrats.find((item) => String(item.statut || "").toUpperCase() === "EN_COURS") || contrats[0] || null, [contrats]);
  const lot = contrat?.lot || {};
  const montantLoyer = Number(contrat?.montantLoyer || lot.loyerBase || 0);
  const validPayments = paiements.filter((item) => String(item.statut || "VALIDE").toUpperCase() === "VALIDE");
  const totalPaid = validPayments.reduce((sum, item) => sum + Number(item.montant || 0), 0);
  const impaye = impayes.find((item) => String(item.contrat?.idContrat) === String(contrat?.idContrat));
  const solde = impaye?.montantDu != null ? Number(impaye.montantDu) : Math.max(0, montantLoyer - totalPaid);

  const filtered = useMemo(() => paiements.filter((item) => {
    if (annee === "Toutes les années") return true;
    const year = item.datePaiement ? new Date(item.datePaiement).getFullYear() : new Date().getFullYear();
    return String(year) === annee;
  }).sort((a, b) => new Date(b.datePaiement || 0) - new Date(a.datePaiement || 0)), [paiements, annee]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const openDeclaration = () => {
    setForm((previous) => ({ ...previous, montant: String(Math.max(0, solde)), reference: `DECL-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-001` }));
    setMessage("");
    navigate("/locataire/paiements/declarer");
  };

  const submitDeclaration = async (event) => {
    event.preventDefault();
    if (!contrat?.idContrat || Number(form.montant) <= 0) {
      setMessage("Sélectionnez un montant valide pour déclarer votre paiement.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      await createPaiement(contrat.idContrat, {
        montant: Number(form.montant),
        datePaiement: form.datePaiement,
        modePaiement: form.modePaiement,
        periode: form.periode,
        reference: form.reference,
        statut: "EN_ATTENTE",
      });
      setMessage("Votre déclaration est prise en compte et attend la validation du gestionnaire.");
      await load();
    } catch (error) {
      setMessage(error?.response?.data?.message || "La déclaration n’a pas pu être enregistrée.");
    } finally {
      setSubmitting(false);
    }
  };

  const modeLabel = (mode) => ({ MOBILE_MONEY: "Mobile Money", VIREMENT: "Virement", ESPECES: "Espèces", CHEQUE: "Chèque" }[mode] || mode || "Virement");

  return (
    <div className="locataire-paiements-page">
      <div className="locataire-paiements-heading"><div><h1>Mes paiements</h1><p>Consultez vos règlements et le solde de votre loyer.</p></div><button type="button" className="locataire-declare-button" onClick={openDeclaration}>+ Déclarer un paiement</button></div>

      {message && <div className="locataire-paiements-message" role="status">{message}</div>}

      <div className="locataire-paiements-metrics">
        <div><span>Total réglé en 2026</span><strong>{money(totalPaid)}</strong><small>{validPayments.length} paiements validés</small></div>
        <div><span>Reste à payer</span><strong>{money(solde)}</strong><small>Loyer de novembre 2026</small></div>
        <div><span>Loyer mensuel</span><strong>{money(montantLoyer)}</strong><small>{contrat ? `Échéance le ${dateText(contrat.dateFin)}` : "Aucun contrat actif"}</small></div>
      </div>

      <div className="locataire-paiements-notice">Une déclaration est prise en compte dans votre solde après validation par le gestionnaire.</div>

      <section className="locataire-paiements-history">
        <div className="locataire-paiements-history-header"><h2>Historique des paiements</h2><select value={annee} onChange={(event) => { setAnnee(event.target.value); setPage(1); }}><option value="Toutes les années">Toutes les années</option><option>2026</option><option>2025</option></select></div>
        <div className="locataire-paiements-table-wrap">
          <table className="locataire-paiements-table"><thead><tr><th>Période</th><th>Date</th><th>Montant</th><th>Mode</th><th>Référence</th><th>Statut</th></tr></thead><tbody>
            {visible.length ? visible.map((paiement) => {
              const statut = String(paiement.statut || "VALIDE").toUpperCase();
              return <tr key={paiement.idPaiement}><td>{paiement.periode || "Novembre 2026"}</td><td>{dateText(paiement.datePaiement)}</td><td><strong>{money(paiement.montant)}</strong></td><td>{modeLabel(paiement.modePaiement)}</td><td>{paiement.reference || `PAY-${paiement.idPaiement}`}</td><td><span className={`locataire-paiement-status ${statut === "EN_ATTENTE" ? "pending" : ""}`}>{statut === "EN_ATTENTE" ? "En attente" : statut === "ANNULE" ? "Annulé" : "Validé"}</span></td></tr>;
            }) : <tr><td colSpan="6" className="locataire-paiements-empty">Aucun paiement trouvé.</td></tr>}
          </tbody></table>
        </div>
      </section>

      <div className="locataire-paiements-footer"><span>{filtered.length} paiements affichés - {paiements.length} au total</span><div className="locataire-paiements-pagination"><button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button type="button" key={number} className={number === page ? "active" : ""} onClick={() => setPage(number)}>{number}</button>)}<button type="button" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>›</button></div></div>
    </div>
  );
}

export default PaiementsLocataire;
