import { AxiosError } from "axios";
import { axiosInstance } from "../lib/api/client";
import { ApiSuccessResponse, TUser } from "@/types";

export const authService = {
  signin: async (data: { email: string; password: string }) => {
    try {
      await axiosInstance.post("/auth/signin", data);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      }
      throw error;
    }
  },

  signup: async (data: { name: string; email: string; password: string }) => {
    try {
      const res = (await axiosInstance.post("/auth/signup", data))
        .data as ApiSuccessResponse<{ user: TUser }, unknown>;
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      }
      throw error;
    }
  },

  verifyEmail: async (data: { otp: string; email: string }) => {
    try {
      const res = (await axiosInstance.post("/auth/verify-email", data))
        .data as ApiSuccessResponse<{ user: TUser }, unknown>;
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      }
      throw error;
    }
  },

  resendVerificationOtp: async (data: { email: string }) => {
    try {
      const res = (await axiosInstance.post("/auth/verify-email/resend", data))
        .data as ApiSuccessResponse<{ user: TUser }, unknown>;
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      }
      throw error;
    }
  },

  getAuthUser: async (token?: string) => {
    const res = (
      await axiosInstance.get("/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data as ApiSuccessResponse<{
      user: TUser;
    }>;

    return res.data;
  },
};
