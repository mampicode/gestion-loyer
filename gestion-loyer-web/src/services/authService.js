import axiosInstance from "../api/axiosInstance";

export const login = async (email, motDePasse) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    motDePasse,
  });
  return response.data;
};

export const registerLocataire = async (data) => {
  const response = await axiosInstance.post("/auth/register-locataire", data);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

export const saveAuthSession = (sessionData) => {
  const { token, user } = sessionData || {};

  if (token) {
    localStorage.setItem("token", token);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};