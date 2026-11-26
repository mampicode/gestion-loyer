import axiosInstance from "../api/axiosInstance";

export const getContrats = async () => {
  const res = await axiosInstance.get("/contrats");
  return res.data;
};

export const createContrat = async (idLocataire, idLot, data) => {
  const res = await axiosInstance.post(
    `/contrats/locataire/${idLocataire}/lot/${idLot}`,
    data
  );
  return res.data;
};

export const updateContrat = async (id, data) => {
  const res = await axiosInstance.put(`/contrats/${id}`, data);
  return res.data;
};

export const getLocataires = async () => {
  const res = await axiosInstance.get("/locataires");
  return res.data;
};

export const getLots = async () => {
  const res = await axiosInstance.get("/lots");
  return res.data;
};

export const getContratsLocataire = async (idLocataire) => {
  const res = await axiosInstance.get(`/contrats/locataire/${idLocataire}`);
  return res.data;
};