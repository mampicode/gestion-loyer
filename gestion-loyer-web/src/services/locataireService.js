import axiosInstance from "../api/axiosInstance";

export const getLocataires = async () => {
  const res = await axiosInstance.get("/locataires");
  return res.data;
};
