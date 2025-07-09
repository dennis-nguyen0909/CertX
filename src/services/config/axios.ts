import axios, { type AxiosInstance } from "axios";
// import { API_URL } from "@/constants";
import { ServiceError } from "../error";

const defaultHeaders = {
  "Content-Type": "application/json",
  LANG: "vi",
  Timezone: "Asia/Saigon",
} as const;

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: defaultHeaders,
});

api.interceptors.response.use(
  (response) => {
    // Nếu là file blob thì trả về nguyên response
    if (response.config && response.config.responseType === "blob") {
      return response;
    }
    return response.data;
  },
  (error) => {
    console.log("error", error);

    if (error.response?.data?.message === "Token đã hết hạn! ") {
      localStorage.clear();

      throw new ServiceError(error.response.data.message);
    }

    throw error;
  }
);

function setupBearerAuthorization(token: string) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export { api, setupBearerAuthorization };

export default api;
