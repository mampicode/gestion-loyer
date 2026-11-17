import axiosInstance from "../api/axiosInstance";

const normalizeFoyer = (foyer) => ({
  ...foyer,
  idFoyer: foyer.idFoyer ?? foyer.id,
  nom: foyer.nom || "Foyer",
  typeFoyer: foyer.typeFoyer || foyer.type || "Immeuble",
  adresse: foyer.adresse || `${foyer.ville || "Abidjan"} - ${foyer.quartier || "Adjiban"}`,
  ville: foyer.ville || "Abidjan",
  quartier: foyer.quartier || "Adjiban",
  lots: foyer.lots ?? 0,
  occupes: foyer.occupes ?? 0,
  loyerMensuel: Number(foyer.loyerMensuel ?? foyer.loyerBase ?? foyer.loyer ?? 0),
});

export const getFoyers = async () => {
  const response = await axiosInstance.get("/foyers");
  return (Array.isArray(response.data) ? response.data : []).map(normalizeFoyer);
};

export const createFoyer = async (foyer) => {
  const response = await axiosInstance.post("/foyers", foyer);
  return normalizeFoyer(response.data);
};

export const updateFoyer = async (id, foyer) => {
  const response = await axiosInstance.put(`/foyers/${id}`, foyer);
  return normalizeFoyer(response.data);
};

export const deleteFoyer = async (id) => {
  await axiosInstance.delete(`/foyers/${id}`);
};

export const searchFoyers = async (keyword) => {
  const response = await axiosInstance.get(`/foyers/search?q=${keyword}`);
  return (Array.isArray(response.data) ? response.data : []).map(normalizeFoyer);
};