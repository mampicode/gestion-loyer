import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getContratsLocataire } from "../../services/contratService";
import { getPaiementsContrat, getImpayesEnCours } from "../../services/paiementService";
import "./ContratLocataire.css";

const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} Ar`;

const dateText = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
};

function ContratLocataire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contrats, setContrats] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [impayes, setImpayes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const idLocataire = user?.id || user?.idUtilisateur;
      try {
        const data = idLocataire ? await getContratsLocataire(idLocataire).catch(() => []) : [];
        const list = Array.isArray(data) ? data : [];
        setContrats(list);

        const active = list.find((item) => String(item.statut || "").toUpperCase() === "EN_COURS") || list[0];
        if (active?.idContrat) {
          const [paiementData, impayeData] = await Promise.all([
            getPaiementsContrat(active.idContrat).catch(() => []),
            getImpayesEnCours().catch(() => []),
          ]);
          setPaiements(Array.isArray(paiementData) ? paiementData : []);
          setImpayes(Array.isArray(impayeData) ? impayeData : []);
        } else {
          setPaiements([]);
          setImpayes([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const contrat = useMemo(() =>
    contrats.find((item) => String(item.statut || "").toUpperCase() === "EN_COURS") || contrats[0] || null,
  [contrats]);

  const lot = contrat?.lot || {};
  const foyer = lot.foyer || {};
  const locataire = contrat?.locataire || {};
  const locataireUser = locataire.utilisateur || locataire;
  const tenantName = `${locataireUser.prenom || user?.prenom || ""} ${locataireUser.nom || user?.nom || "Locataire"}`.trim();
  const typeLot = lot.typeLot || "Appartement";
  const lotNumber = lot.numero || "A-204";
  const montantLoyer = Number(contrat?.montantLoyer || lot.loyerBase || 0);

  const paid = paiements
    .filter((item) => String(item.statut || "VALIDE").toUpperCase() === "VALIDE")
    .reduce((sum, item) => sum + Number(item.montant || 0), 0);
  const impaye = impayes.find((item) => String(item.contrat?.idContrat) === String(contrat?.idContrat));
  const solde = impaye?.montantDu != null
    ? Number(impaye.montantDu)
    : Math.max(0, montantLoyer - paid);

  const address = foyer.adresse
    ? `${foyer.quartier ? `${foyer.quartier} • ` : ""}${foyer.adresse}${foyer.ville ? ` • ${foyer.ville}` : ""}`
    : "Cocody • Boulevard des Jardins • Abidjan";

  const echeanceText = contrat?.dateFin
    ? `au plus tard le ${dateText(contrat.dateFin).replace(/^0/, "").replace(/\bjanvier\b/i, "5 janvier")}`
    : `au plus tard le 5 de chaque mois`;

  return (
    <div className="locataire-contract-page">
      <div className="locataire-contract-heading">
        <div>
          <h1>Mon contrat de location</h1>
          <p>Les informations essentielles de votre logement et vos échéances.</p>
        </div>
        {contrat && <span className="locataire-contract-active">Contrat actif</span>}
      </div>

      {loading ? (
        <div className="locataire-contract-loading">Chargement du contrat…</div>
      ) : !contrat ? (
        <div className="locataire-contract-empty">Aucun contrat actif n’est associé à votre compte.</div>
      ) : (
        <div className="locataire-contract-layout">
          <section className="locataire-contract-main">
            <div className="locataire-contract-reference">CTR-{String(contrat.idContrat || "").padStart(6, "0")}</div>
            <h2>{foyer.nom || "Les Acacias"} • {typeLot} {lotNumber}</h2>
            <p className="locataire-contract-address">{address}</p>

            <div className="locataire-contract-info-grid">
              <div><span>Titulaire du contrat</span><strong>{tenantName}</strong></div>
              <div><span>Type de lot</span><strong>{typeLot}</strong></div>
              <div><span>Date de début</span><strong>{dateText(contrat.dateDebut)}</strong></div>
              <div><span>Date de fin</span><strong>{dateText(contrat.dateFin)}</strong></div>
              <div><span>Loyer mensuel</span><strong>{money(montantLoyer)}</strong></div>
              <div><span>Jour d’échéance</span><strong>Le 5 de chaque mois</strong></div>
            </div>

            <div className="locataire-contract-next">
              <strong>Votre prochaine échéance</strong>
              <p>{money(montantLoyer)} à régler {echeanceText}</p>
            </div>
          </section>

          <aside className="locataire-contract-sidebar">
            <div className="locataire-manager-card">
              <h2>Votre gestionnaire</h2>
              <strong>Service de gestion locative</strong>
              <span>gestion@loca.example</span>
              <p>Pour une demande liée au logement, utilisez votre espace réclamations.</p>
              <button type="button" onClick={() => navigate("/locataire/reclamations")}>Signaler un problème <span>→</span></button>
            </div>

            <div className="locataire-contract-solde">
              <span>SOLDE DE NOVEMBRE</span>
              <strong>{money(solde)}</strong>
              <small>Échéance dépassée de 8 jours</small>
              <button type="button" onClick={() => navigate("/locataire/paiements/declarer")}>Déclarer un paiement <span>→</span></button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default ContratLocataire;
