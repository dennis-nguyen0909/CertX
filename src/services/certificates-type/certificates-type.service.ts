import { ResponseType } from "@/types/response";
import { api } from "../config/axios";
import { CertificateType } from "@/models/certificates-type";
import { PaginatedListResponse } from "@/models/common";
import { transformPaginatedList } from "@/utils/pagination";

export const CertificatesTypeService = {
  findAll: async (
    pageIndex: number,
    pageSize: number,
    name: string,
    sort: string[]
  ) => {
    const response = await api.get<PaginatedListResponse<CertificateType>>(
      "/v1/pdt/certificate_type",
      {
        params: { page: pageIndex, size: pageSize, name, sort },
      }
    );
    return transformPaginatedList(response.data);
  },
  create: async (name: string) => {
    const response = await api.post<ResponseType<CertificateType>>(
      "/v1/pdt/certificate_type/create",
      { name }
    );
    return response.data;
  },
  update: async (id: number, name: string) => {
    const response = await api.put<ResponseType<CertificateType>>(
      `/v1/pdt/certificate_type/${id}`,
      { name }
    );
    return response;
  },
  getById: async (id: number) => {
    const response = await api.get<CertificateType>(
      `/v1/pdt/certificate_type-detail/${id}`
    );
    return response.data;
  },
};
