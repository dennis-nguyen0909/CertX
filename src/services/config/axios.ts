import axios, { type AxiosInstance } from "axios";
import { ServiceError } from "../error";
import { eventBus } from "@/lib/eventBus";

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
    if (response.config && response.config.responseType === "blob") {
      return response;
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message;
    if (error.status === 401) {
      eventBus.emit("SESSION_EXPIRED");
      throw new ServiceError(message);
    }
    throw error;
  }
);

function setupBearerAuthorization(token: string) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export { api, setupBearerAuthorization };
export default api;
