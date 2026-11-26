import axiosInstance from "../api/axiosInstance";

export const getReclamations = async () => {
  const res = await axiosInstance.get("/reclamations");
  return res.data;
};

export const createReclamation = async (data) => {
  const payload = data || {};
  const idLocataire = payload.idLocataire || payload.locataireId;
  const idLot = payload.idLot || payload.lotId;

  const res = await axiosInstance.post(
    idLocataire ? `/reclamations/locataire/${idLocataire}${idLot ? `?idLot=${idLot}` : ""}` : "/reclamations",
    payload
  );
  return res.data;
};

export const updateReclamationStatut = async (id, statut) => {
  const res = await axiosInstance.patch(`/reclamations/${id}/statut?statut=${encodeURIComponent(statut)}`);
  return res.data;
};

export const getReclamationsLocataire = async (idLocataire) => {
  const res = await axiosInstance.get(`/reclamations/locataire/${idLocataire}`);
  return res.data;
};