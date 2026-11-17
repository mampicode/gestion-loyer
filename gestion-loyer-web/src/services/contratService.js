import axiosInstance from "../api/axiosInstance";

export const getContrats = async () => {
  const res = await axiosInstance.get("/contrats");
  return res.data;
};

export const createContrat = async (data) => {
  const res = await axiosInstance.post("/contrats", data);
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