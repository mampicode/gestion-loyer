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

export const uploadDocument = async (idUtilisateur, typeDocument, file) => {
  const formData = new FormData();
  formData.append("typeDocument", typeDocument);
  formData.append("file", file);
  const res = await axiosInstance.post(`/documents/utilisateur/${idUtilisateur}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
