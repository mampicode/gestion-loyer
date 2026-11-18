import axiosInstance from "../api/axiosInstance";

export const getStats = async () => {
  try {
    const [foyers, lots, contrats, impayes] = await Promise.all([
      axiosInstance.get("/foyers"),
      axiosInstance.get("/lots"),
      axiosInstance.get("/contrats"),
      axiosInstance.get("/impayes"),
    ]);

    const foyersData = foyers.data || [];
    const nbMaisons = foyersData.filter((f) => f.typeFoyer === "Maison").length;
    const nbImmeubles = foyersData.filter((f) => f.typeFoyer === "Immeuble").length;

    const contratsData = contrats.data || [];
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const renouvellements = contratsData.filter((c) => {
  if (!c.dateFin) return false;
  const fin = new Date(c.dateFin);
  return fin.getMonth() === currentMonth && fin.getFullYear() === currentYear;
}).length;

const impayesData = impayes.data || [];
const aRelancer = impayesData.filter((i) => i.statut === "EN_COURS" || i.statut === "RELANCE").length;

    return {
      foyers: foyersData.length,
      maisons: nbMaisons,
      immeubles: nbImmeubles,
      lots: lots.data?.length || 0,
      contrats: contrats.data?.length || 0,
      impayes: impayes.data?.length || 0,
      renouvellements: renouvellements,
      aRelancer: aRelancer, 
    };
  } catch {
    return { foyers: 0, maisons: 0, immeubles: 0, lots: 0, contrats: 0, impayes: 0, renouvellements: 0 , aRelancer: 0,};
  }
};

export const getAlertes = async () => {
  try {
    const [impayesRes, reclamationsRes] = await Promise.all([
      axiosInstance.get("/impayes"),
      axiosInstance.get("/reclamations"),
    ]);

    const impayes = impayesRes.data || [];
    const reclamations = reclamationsRes.data || [];

    const totalDu = impayes.reduce((sum, i) => sum + (i.montantDu || 0), 0);
    const reclamationsOuvertes = reclamations.filter(
      (r) => r.statut === "OUVERTE" || r.statut === "EN_COURS"
    );

    return {
      nbImpayes: impayes.length,
      totalDu,
      nbReclamations: reclamationsOuvertes.length,
    };
  } catch {
    return { nbImpayes: 0, totalDu: 0, nbReclamations: 0 };
  }
};

export const getDerniersPaiements = async () => {
  try {
    const res = await axiosInstance.get("/paiements");
    const paiements = res.data || [];
    return paiements
      .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))
      .slice(0, 5);
  } catch {
    return [];
  }
};

