import axiosInstance from "../api/axiosInstance";

const fallback = {
  foyers: 0,
  lots: 0,
  lotsOccupe: 0,
  totalLots: 0,
  contrats: 0,
  impayes: 0,
  locataires: 0,
  reclamations: 0,
};

export const getStats = async () => {
  try {
    const [foyersRes, lotsRes, contratsRes, impayesRes, reclamationsRes] = await Promise.all([
      axiosInstance.get("/foyers").catch(() => ({ data: [] })),
      axiosInstance.get("/lots").catch(() => ({ data: [] })),
      axiosInstance.get("/contrats").catch(() => ({ data: [] })),
      axiosInstance.get("/impayes/en-cours").catch(() => ({ data: [] })),
      axiosInstance.get("/reclamations").catch(() => ({ data: [] })),
    ]);

    const foyers = Array.isArray(foyersRes.data) ? foyersRes.data : [];
    const lots = Array.isArray(lotsRes.data) ? lotsRes.data : [];
    const contrats = Array.isArray(contratsRes.data) ? contratsRes.data : [];
    const impayes = Array.isArray(impayesRes.data) ? impayesRes.data : [];
    const reclamations = Array.isArray(reclamationsRes.data) ? reclamationsRes.data : [];

    const totalLots = lots.length;
    const lotsOccupe = lots.filter((lot) => {
      const statut = String(lot.statut || lot.status || "").toUpperCase();
      return statut === "OCCUPE" || statut === "ACTIF";
    }).length;

    const impayesTotal = impayes.reduce((sum, item) => {
      const value = Number(item.montantRestant ?? item.montantDu ?? item.montant ?? 0);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    return {
      foyers: foyers.length,
      lots: totalLots,
      lotsOccupe,
      totalLots,
      contrats: contrats.length,
      impayes: impayesTotal,
      locataires: contrats.length,
      reclamations: reclamations.length,
    };
  } catch (error) {
    console.warn("Stats dashboard indisponibles.", error);
    return fallback;
  }
};