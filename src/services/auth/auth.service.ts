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
};
