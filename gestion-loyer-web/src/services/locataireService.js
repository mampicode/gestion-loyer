import axiosInstance from "../api/axiosInstance";

export const getLocataires = async () => {
  const res = await axiosInstance.get("/locataires");
  return res.data;
};

export const getUtilisateurs = async () => {
  const res = await axiosInstance.get("/utilisateurs");
  return res.data;
};

export const getLocataireById = async (id) => {
  const res = await axiosInstance.get(`/utilisateurs/${id}`);
  return res.data;
};
