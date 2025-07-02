import { ResponseType } from "@/types/response";
import { api } from "../config/axios";
import {
  AccessTokenResponse,
  LoginRequest,
  VerifyRequest,
} from "@/models/auth";

export const AuthService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<AccessTokenResponse>("/auth/login", data);
    return response;
  },
  loginForStudent: async (data: LoginRequest) => {
    const response = await api.post<AccessTokenResponse>(
      "/auth/student-login",
      data
    );
    return response;
  },
  register: async (data: FormData) => {
    const response = await api.post<unknown>("/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  verify: async (data: VerifyRequest) => {
    const response = await api.post<ResponseType<null>>(
      "/auth/verify-otp",
      data
    );
    return response;
  },
  logout: async () => {
    const response = await api.post<unknown>("/logout");
    console.log("response1111", response);
    return response;
  },
  resendOtp: async (data: { email: string }) => {
    const response = await api.post("/auth/resend-registration-otp", data);
    return response;
  },
  forgotPassword: async (data: { email: string }) => {
    const response = await api.post("/auth/forgot-password", data);
    return response;
  },
  verifyOtpForgotPassword: async (data: { email: string; otp: string }) => {
    const response = await api.post("/auth/verify-otp-forgot-password", data);
    return response;
  },
  resetPassword: async (data: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.post("/auth/reset-password", data);
    return response;
  },
  forgotPasswordStudent: async (data: { email: string }) => {
    const response = await api.post("/auth/student/forgot-password", data);
    return response;
  },
  verifyOtpForgotPasswordStudent: async (data: {
    email: string;
    otp: string;
  }) => {
    const response = await api.post(
      "/auth/student/verify-otp-forgot-password",
      data
    );
    return response;
  },
  resetPasswordStudent: async (data: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.post("/auth/student/reset-password", data);
    return response;
  },
  studentChangePassword: async (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.put("/v1/student/change-password", data);
    return response;
  },
};
