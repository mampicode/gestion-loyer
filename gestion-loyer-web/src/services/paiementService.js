import axiosInstance from "../api/axiosInstance";

export const getPaiements = async () => {
  const res = await axiosInstance.get("/paiements");
  return res.data;
};

export const createPaiement = async (contractIdOrData, maybeData) => {
  const payload = maybeData || contractIdOrData || {};
  const idContrat = maybeData ? contractIdOrData : payload.idContrat || payload.contratId;

  const safePayload = {
    ...payload,
    montant: Number(payload.montant ?? 0),
    statut: payload.statut || "VALIDE",
    datePaiement: payload.datePaiement || new Date().toISOString(),
  };

  const res = await axiosInstance.post(`/paiements/contrat/${idContrat}`, safePayload);
  return res.data;
};

export const getContrats = async () => {
  const res = await axiosInstance.get("/contrats");
  return res.data;
};

export const getImpayes = async () => {
  const res = await axiosInstance.get("/impayes");
  return res.data;
};

export const getImpayesEnCours = async () => {
  const res = await axiosInstance.get("/impayes/en-cours");
  return res.data;
};

export const getPaiementsContrat = async (idContrat) => {
  const res = await axiosInstance.get(`/paiements/contrat/${idContrat}`);
  return res.data;
};

