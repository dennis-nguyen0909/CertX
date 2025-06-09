import { ResponseType } from "@/types/response";
import { api } from "../config/axios";
import {
  Certificate,
  CertificateCreateRequest,
  CertificateUpdateRequest,
  CertificateSearchParams,
  CertificateListResponse,
  ExcelUploadResponse,
  StudentSearchResponse,
} from "@/models/certificate";
import { PaginatedListResponse } from "@/models/common";

export const CertificatesService = {
  // GET /api/v1/khoa/list-certificates
  listCertificates: async (params?: CertificateSearchParams) => {
    const response = await api.get<CertificateListResponse>(
      "/api/v1/khoa/list-certificates",
      { params }
    );
    return response.data;
  },

  // GET /api/v1/certificate-detail/{id}
  getCertificateDetail: async (id: number) => {
    const response = await api.get<Certificate>(`/v1/certificate-detail/${id}`);
    return response.data;
  },

  // POST /api/v1/khoa/create-certificate
  createCertificate: async (data: CertificateCreateRequest) => {
    const response = await api.post<ResponseType<Certificate>>(
      "/api/v1/khoa/create-certificate",
      data
    );
    return response.data;
  },

  // PUT /api/v1/khoa/update-certificate/{id}
  updateCertificate: async (id: number, data: CertificateUpdateRequest) => {
    const response = await api.put<ResponseType<Certificate>>(
      `/api/v1/khoa/update-certificate/${id}`,
      data
    );
    return response.data;
  },

  // POST /api/v1/khoa/certificate/create-excel
  createCertificateFromExcel: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ResponseType<ExcelUploadResponse>>(
      "/api/v1/khoa/certificate/create-excel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // GET /api/v1/khoa/student-search
  searchStudents: async (query: string) => {
    const response = await api.get<ResponseType<StudentSearchResponse>>(
      "/api/v1/khoa/student-search",
      {
        params: { query },
      }
    );
    return response.data;
  },

  // GET /api/v1/pdt/list-certificates
  listPdtCertificates: async (params?: CertificateSearchParams) => {
    const response = await api.get<PaginatedListResponse<Certificate>>(
      "v1/pdt/list-certificates",
      { params }
    );
    return response.data;
  },

  // GET /api/v1/admin/list-certificates
  listAdminCertificates: async (params?: CertificateSearchParams) => {
    const response = await api.get<PaginatedListResponse<Certificate>>(
      "/api/v1/admin/list-certificates",
      { params }
    );
    return response.data;
  },
};
