import axiosInstance from "../api/axiosInstance";

export const getRapportImpayes = async () => {
  const res = await axiosInstance.get("/rapports/impayes");
  return res.data;
};

export const getRapportPaiements = async (mois, annee) => {
  const query = new URLSearchParams({
    mois: mois || "",
    annee: annee || "",
  }).toString();

  const res = await axiosInstance.get(`/rapports/paiements${query ? `?${query}` : ""}`);
  return res.data;
};

export const getChiffreAffaires = async () => {
  const res = await axiosInstance.get("/rapports/ca");
  return res.data;
};