import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardLocataire.css";
import { useAuth } from "../../context/AuthContext";
import { getContratsLocataire } from "../../services/contratService";
import { getPaiementsContrat, getImpayesEnCours } from "../../services/paiementService";
import { getReclamationsLocataire } from "../../services/reclamationService";

const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} Ar`;
const dateText = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

function DashboardLocataire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contrats, setContrats] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [reclamations, setReclamations] = useState([]);
  const [impayes, setImpayes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idLocataire = user?.id || user?.idUtilisateur;
    const load = async () => {
      setLoading(true);
      try {
        const contratData = idLocataire ? await getContratsLocataire(idLocataire).catch(() => []) : [];
        const list = Array.isArray(contratData) ? contratData : [];
        setContrats(list);
        const contratActif = list.find((item) => String(item.statut || "").toUpperCase() === "EN_COURS") || list[0];
        const idContrat = contratActif?.idContrat;
        const [paiementData, reclamationData, impayeData] = await Promise.all([
          idContrat ? getPaiementsContrat(idContrat).catch(() => []) : Promise.resolve([]),
          idLocataire ? getReclamationsLocataire(idLocataire).catch(() => []) : Promise.resolve([]),
          getImpayesEnCours().catch(() => []),
        ]);
        setPaiements(Array.isArray(paiementData) ? paiementData : []);
        setReclamations(Array.isArray(reclamationData) ? reclamationData : []);
        setImpayes(Array.isArray(impayeData) ? impayeData : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const contrat = useMemo(() => contrats.find((item) => String(item.statut || "").toUpperCase() === "EN_COURS") || contrats[0] || null, [contrats]);
  const lot = contrat?.lot || {};
  const foyer = lot.foyer || {};
  const impaye = impayes.find((item) => String(item.contrat?.idContrat) === String(contrat?.idContrat));
  const montantLoyer = Number(contrat?.montantLoyer || lot.loyerBase || 0);
  const totalPaye = paiements.filter((item) => String(item.statut || "VALIDE").toUpperCase() === "VALIDE").reduce((sum, item) => sum + Number(item.montant || 0), 0);
  const solde = impaye?.montantDu != null ? Number(impaye.montantDu) : Math.max(0, montantLoyer - totalPaye);
  const progress = montantLoyer ? Math.min(100, (totalPaye / montantLoyer) * 100) : 0;
  const openReclamations = reclamations.filter((item) => !["RESOLUE", "FERME", "FERMEE", "CLOTURE", "CLOTUREE"].includes(String(item.statut || "OUVERT").toUpperCase())).length;
  const sortedPayments = [...paiements].sort((a, b) => new Date(b.datePaiement || 0) - new Date(a.datePaiement || 0));
  const firstName = user?.prenom || "Aicha";

  return (
    <div className="locataire-dashboard">
      <div className="locataire-dashboard-heading">
        <div><h1>Bonjour {firstName},</h1><p>Bienvenue chez vous. Retrouvez votre situation locative en toute simplicité.</p></div>
        <span>{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>

      <div className="locataire-dashboard-grid">
        <section className="locataire-rent-card">
          <div className="locataire-rent-card-header"><div><span>VOTRE RESTE À PAYER : NOVEMBRE 2026</span><strong>{money(solde)}</strong></div><span className="locataire-rent-status">{loading ? "Chargement" : solde > 0 ? "8 jours de retard" : "À jour"}</span></div>
          <div className="locataire-rent-progress"><span>Loyer : {money(montantLoyer)} • Déjà réglé : {money(totalPaye)}</span><div className="locataire-progress-track"><div style={{ width: `${progress}%` }} /></div></div>
          <div className="locataire-rent-actions"><button type="button" className="locataire-pay-button" onClick={() => navigate("/locataire/paiements")}>Déclarer un paiement <span>→</span></button><span>Échéance : {dateText(contrat?.dateFin)}</span></div>
        </section>

        <aside className="locataire-property-card">
          <span className="locataire-contract-status">Contrat actif</span>
          <h2>{foyer.nom || "Les Acacias"}</h2>
          <p>{lot.numero ? `${lot.typeLot || "Appartement"} ${lot.numero}` : lot.typeLot || "Appartement A-204"}</p>
          <address>{foyer.adresse || foyer.localisation || "Cocody • Boulevard des Jardins"}</address>
          <button type="button" onClick={() => navigate("/locataire/contrat")}>Voir mon contrat <span>→</span></button>
        </aside>
      </div>

      <section className="locataire-reclamation-banner"><div><h2>Un problème dans votre logement ?</h2><p>{openReclamations} réclamation ouverte • Fuite sous l’évier • Signalée aujourd’hui</p></div><button type="button" onClick={() => navigate("/locataire/reclamations")}>Suivre mes réclamations <span>→</span></button></section>

      <section className="locataire-payment-history">
        <div className="locataire-payment-history-header"><h2>Historique des paiements</h2><button type="button" onClick={() => navigate("/locataire/paiements")}>Tout voir <span>→</span></button></div>
        <div className="locataire-payment-table-wrap"><table className="locataire-payment-table"><thead><tr><th>Période</th><th>Date</th><th>Montant</th><th>Mode</th><th>Référence</th><th>Statut</th></tr></thead><tbody>
          {sortedPayments.length ? sortedPayments.slice(0, 6).map((paiement) => (
            <tr key={paiement.idPaiement}><td>{paiement.periode || "Novembre 2026"}</td><td>{dateText(paiement.datePaiement)}</td><td><strong>{money(paiement.montant)}</strong></td><td>{paiement.modePaiement === "MOBILE_MONEY" ? "Mobile Money" : paiement.modePaiement === "VIREMENT" ? "Virement" : paiement.modePaiement === "CHEQUE" ? "Chèque" : "Espèces"}</td><td>{paiement.reference || `MM-${paiement.idPaiement}`}</td><td><span className="locataire-payment-status">Validé</span></td></tr>
          )) : <tr><td colSpan="6" className="locataire-payment-empty">Aucun paiement enregistré.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

export default DashboardLocataire;