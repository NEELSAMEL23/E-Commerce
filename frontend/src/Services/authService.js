import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const registerService = async (formData) => {
  try {
    const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginService = async (payload) => {
  try {
    const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, payload);
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const getProfileService = async () => {
  try {
    const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Unable to fetch profile" };
  }
};

export const logoutService = () => {
  localStorage.removeItem("token");
};
