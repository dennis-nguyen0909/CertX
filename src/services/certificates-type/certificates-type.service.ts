import { ResponseType } from "@/types/response";
import { api } from "../config/axios";
import {
  CertificatesTypeNode,
  CertificateType,
} from "@/models/certificates-type";
import { PaginatedListResponse } from "@/models/common";
import { transformPaginatedList } from "@/utils/pagination";

export const CertificatesTypeService = {
  findAll: async (
    pageIndex: number,
    pageSize: number,
    name: string,
    sort: string[]
  ) => {
    const response = await api.get<PaginatedListResponse<CertificatesTypeNode>>(
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
      `/certificates-type/${id}`,
      { name }
    );
    return response;
  },
};
