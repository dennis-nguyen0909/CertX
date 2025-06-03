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
      "/v1/pdt/certificate-type",
      {
        params: { page: pageIndex, size: pageSize, name, sort },
      }
    );
    return transformPaginatedList(response.data);
  },
  create: async (name: string) => {
    const response = await api.post<ResponseType<CertificateType>>(
      "/v1/pdt/certificate-type/create",
      { name }
    );
    return response.data;
  },
  update: async (id: number, name: string) => {
    const formData = new FormData();
    formData.append("name", name);

    const response = await api.put<ResponseType<CertificateType>>(
      `/v1/pdt/update-certificate_type/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  },
  getById: async (id: number) => {
    const response = await api.get<CertificateType>(
      `/v1/pdt/certificate-type-detail/${id}`
    );
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ResponseType<CertificateType>>(
      `/v1/pdt/delete-certificate_type/${id}`
    );
    return response.data;
  },
};
