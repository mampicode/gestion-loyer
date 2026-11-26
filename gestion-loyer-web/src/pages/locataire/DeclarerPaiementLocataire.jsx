import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getContratsLocataire } from "../../services/contratService";
import { getPaiementsContrat, getImpayesEnCours, createPaiement } from "../../services/paiementService";
import { uploadDocument } from "../../services/locataireService";
import "./DeclarerPaiementLocataire.css";

const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} Ar`;

function DeclarerPaiementLocataire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [contrats, setContrats] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [impayes, setImpayes] = useState([]);
  const [justificatif, setJustificatif] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    periode: "Novembre 2026",
    montant: "50000",
    datePaiement: "2026-11-13",
    modePaiement: "MOBILE_MONEY",
    reference: "MM-261113-092",
  });

  useEffect(() => {
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
    load();
  }, [user]);

  const contrat = useMemo(() => contrats.find((item) => String(item.statut || "").toUpperCase() === "EN_COURS") || contrats[0] || null, [contrats]);
  const lot = contrat?.lot || {};
  const foyer = lot.foyer || {};
  const montantLoyer = Number(contrat?.montantLoyer || lot.loyerBase || 0);
  const registered = paiements.filter((item) => String(item.statut || "VALIDE").toUpperCase() === "VALIDE").reduce((sum, item) => sum + Number(item.montant || 0), 0);
  const impaye = impayes.find((item) => String(item.contrat?.idContrat) === String(contrat?.idContrat));
  const solde = impaye?.montantDu != null ? Number(impaye.montantDu) : Math.max(0, montantLoyer - registered);

  const handleFile = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setMessage("Le justificatif doit être au format PDF, JPG ou PNG.");
      event.target.value = "";
      setJustificatif(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Le justificatif ne doit pas dépasser 5 Mo.");
      event.target.value = "";
      setJustificatif(null);
      return;
    }
    setMessage("");
    setJustificatif(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!contrat?.idContrat) {
      setMessage("Aucun contrat actif n’est associé à votre compte.");
      return;
    }
    if (Number(form.montant) <= 0) {
      setMessage("Le montant reçu doit être supérieur à zéro.");
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
      const idLocataire = user?.id || user?.idUtilisateur;
      if (justificatif && idLocataire) {
        await uploadDocument(idLocataire, "JUSTIFICATIF_PAIEMENT", justificatif);
      }
      navigate("/locataire/paiements", { replace: true, state: { declarationSuccess: true } });
    } catch (error) {
      setMessage(error?.response?.data?.message || "La déclaration n’a pas pu être enregistrée.");
    } finally {
      setSubmitting(false);
    }
  };

  const remaining = Math.max(0, solde - Number(form.montant || 0));

  return (
    <div className="locataire-declaration-page">
      <button type="button" className="locataire-declaration-back" onClick={() => navigate("/locataire/paiements")}>‹ <span>Mes paiements</span></button>
      <div className="locataire-declaration-heading"><h1>Déclarer un paiement</h1><p>Vous avez déjà réglé votre loyer ? Transmettez les informations au gestionnaire.</p></div>
      {message && <div className="locataire-declaration-message" role="status">{message}</div>}

      <form onSubmit={handleSubmit} className="locataire-declaration-layout">
        <section className="locataire-declaration-form-card">
          <h2>Informations du règlement</h2>
          <div className="locataire-declaration-grid">
            <label>Période concernée <span>*</span><select value={form.periode} onChange={(event) => setForm((previous) => ({ ...previous, periode: event.target.value }))}><option>Novembre 2026</option><option>Décembre 2026</option><option>Janvier 2027</option></select></label>
            <label>Montant payé (Ar) <span>*</span><input type="number" min="1" value={form.montant} onChange={(event) => setForm((previous) => ({ ...previous, montant: event.target.value }))} required /></label>
            <label>Date du paiement <span>*</span><input type="date" value={form.datePaiement} onChange={(event) => setForm((previous) => ({ ...previous, datePaiement: event.target.value }))} required /></label>
            <label>Mode de paiement <span>*</span><select value={form.modePaiement} onChange={(event) => setForm((previous) => ({ ...previous, modePaiement: event.target.value }))}><option value="MOBILE_MONEY">Mobile Money</option><option value="VIREMENT">Virement</option><option value="ESPECES">Espèces</option><option value="CHEQUE">Chèque</option></select></label>
            <label className="locataire-declaration-full">Référence du paiement <span>*</span><input value={form.reference} onChange={(event) => setForm((previous) => ({ ...previous, reference: event.target.value }))} required /></label>
            <div className="locataire-declaration-upload locataire-declaration-full"><label>Justificatif (facultatif)</label><button type="button" onClick={() => fileInputRef.current?.click()}><strong>↑</strong> {justificatif ? justificatif.name : "Cliquez pour joindre votre justificatif"}</button><input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} hidden /><small>PDF, JPG ou PNG · 5 Mo maximum</small></div>
          </div>
          <p class="locataire-declaration-hint">Cette déclaration ne déclenche pas directement de paiement en ligne.<br />Modes acceptés : Espèces • Mobile Money • Virement • Chèque</p>
        </section>

        <aside className="locataire-declaration-summary"><h2>Votre situation</h2><div className="locataire-declaration-property"><strong>{foyer.nom || "Les Acacias"}</strong><span>{lot.numero ? `${lot.typeLot || "Appartement"} ${lot.numero}` : "Appartement A-204"}</span></div><div className="locataire-declaration-status-row"><span>Loyer de novembre</span><strong>{money(montantLoyer)}</strong></div><div className="locataire-declaration-status-row"><span>Montant validé</span><strong>{money(registered)}</strong></div><div className="locataire-declaration-status-row"><span>Reste à payer</span><strong>{money(solde)}</strong></div><div className="locataire-declaration-pending"><strong>En attente de validation</strong><p>Votre solde sera mis à jour uniquement après confirmation par le gestionnaire.</p></div></aside>

        <div className="locataire-declaration-actions"><button type="button" onClick={() => navigate("/locataire/paiements")}>Annuler</button><button type="submit" disabled={submitting}>{submitting ? "Envoi…" : "Envoyer la déclaration"} {!submitting && <span>→</span>}</button></div>
      </form>
    </div>
  );
}

export default DeclarerPaiementLocataire;
