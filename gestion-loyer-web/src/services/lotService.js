import axiosInstance from "../api/axiosInstance";

export const getLots = async () => {
  const res = await axiosInstance.get("/lots");
  return res.data;
};

export const createLot = async (data) => {
  const payload = {
    ...data,
    numero: data.numero || data.reference || `LOT-${Date.now()}`,
    typeLot: data.typeLot || data.type || "Appartement",
    superficie: Number(data.superficie ?? data.surface ?? 0),
    surface: Number(data.superficie ?? data.surface ?? 0),
    loyerBase: Number(data.loyerBase ?? data.loyer ?? 0),
    loyer: Number(data.loyerBase ?? data.loyer ?? 0),
    statut: data.statut || "LIBRE",
    idFoyer: data.idFoyer || data.foyerId,
  };

  const res = await axiosInstance.post("/lots", payload);
  return res.data;
};

export const updateLot = async (id, data) => {
  const payload = {
    ...data,
    numero: data.numero || data.reference || `LOT-${id}`,
    typeLot: data.typeLot || data.type || "Appartement",
    superficie: Number(data.superficie ?? data.surface ?? 0),
    surface: Number(data.superficie ?? data.surface ?? 0),
    loyerBase: Number(data.loyerBase ?? data.loyer ?? 0),
    loyer: Number(data.loyerBase ?? data.loyer ?? 0),
    statut: data.statut || "LIBRE",
  };

  const res = await axiosInstance.put(`/lots/${id}`, payload);
  return res.data;
};

export const deleteLot = async (id) => axiosInstance.delete(`/lots/${id}`);
