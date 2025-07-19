import { ResponseType } from "@/types/response";
import { api } from "../config/axios";
import {
  Certificate,
  CertificateCreateRequest,
  CertificateUpdateRequest,
  CertificateSearchParams,
  ExcelUploadResponse,
  StudentSearchResponse,
  ExportTypeCertificate,
} from "@/models/certificate";
import { PaginatedListResponse } from "@/models/common";

export const CertificatesService = {
  // Unified certificates list method with role parameter
  listCertificates: async (role: string, params?: CertificateSearchParams) => {
    // Use the existing role-specific methods instead of creating new endpoints
    switch (role) {
      case "KHOA":
        return CertificatesService.listKhoaCertificatesOriginal(params);
      case "PDT":
        return CertificatesService.listPdtCertificatesOriginal(params);
      case "ADMIN":
        return CertificatesService.listAdminCertificatesOriginal(params);
      default:
        return CertificatesService.listKhoaCertificatesOriginal(params);
    }
  },

  // Original methods with different names to avoid circular reference
  listKhoaCertificatesOriginal: async (params?: CertificateSearchParams) => {
    const response = await api.get<PaginatedListResponse<Certificate>>(
      "v1/khoa/list-certificates",
      { params }
    );
    return response.data;
  },

  listPdtCertificatesOriginal: async (params?: CertificateSearchParams) => {
    const response = await api.get<PaginatedListResponse<Certificate>>(
      "v1/pdt/list-certificates",
      { params }
    );
    return response.data;
  },

  listAdminCertificatesOriginal: async (params?: CertificateSearchParams) => {
    const response = await api.get<PaginatedListResponse<Certificate>>(
      "v1/admin/list-certificates",
      { params }
    );
    return response.data;
  },

  // Pending certificates for PDT role
  listCertificatesPending: async (
    params?: CertificateSearchParams,
    role?: string
  ) => {
    const response = await api.get<PaginatedListResponse<Certificate>>(
      `v1/${role?.toLowerCase()}/list-certificates-pending`,
      { params }
    );
    return response.data;
  },

  listCertificatesRejected: async (
    params?: CertificateSearchParams,
    role?: string
  ) => {
    const response = await api.get<PaginatedListResponse<Certificate>>(
      `v1/${role?.toLowerCase()}/list-certificates-rejected`,
      { params }
    );
    return response.data;
  },
  listCertificatesApproved: async (
    params?: CertificateSearchParams,
    role?: string
  ) => {
    const response = await api.get<PaginatedListResponse<Certificate>>(
      `v1/${role?.toLowerCase()}/list-certificates-approved`,
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
    const formData = new FormData();

    // Extract studentId from the data
    const { studentId, ...certificateData } = data;

    // Add the certificate data as a JSON string in the "data" field
    formData.append("data", JSON.stringify(certificateData));

    // Add studentId as a separate field
    if (studentId) {
      formData.append("studentId", studentId.toString());
    }

    const response = await api.post<ResponseType<Certificate>>(
      "v1/khoa/create-certificate",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // PUT /api/v1/khoa/update-certificate/{id}
  updateCertificate: async (id: number, data: CertificateUpdateRequest) => {
    const response = await api.put<ResponseType<Certificate>>(
      `v1/khoa/update-certificate/${id}`,
      data
    );
    return response.data;
  },

  // POST /api/v1/khoa/certificate/create-excel
  createCertificateFromExcel: async (file: File, certificateTypeId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("certificateTypeId", certificateTypeId);

    const response = await api.post<ResponseType<ExcelUploadResponse>>(
      "v1/khoa/certificate/create-excel",
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
      "v1/khoa/student-search",
      {
        params: { query },
      }
    );
    return response.data;
  },

  verifyCertificate: async (ipfsUrl: string) => {
    const response = await api.get<Certificate>(`v1/verify`, {
      params: { ipfsUrl, type: "certificate" },
    });
    return response;
  },

  // Legacy methods - keeping for backward compatibility but will be deprecated
  listKhoaCertificates: async (params?: CertificateSearchParams) => {
    return CertificatesService.listKhoaCertificatesOriginal(params);
  },

  listPdtCertificates: async (params?: CertificateSearchParams) => {
    return CertificatesService.listPdtCertificatesOriginal(params);
  },

  listAdminCertificates: async (params?: CertificateSearchParams) => {
    return CertificatesService.listAdminCertificatesOriginal(params);
  },

  listCertificatePending: async (params?: CertificateSearchParams) => {
    return CertificatesService.listCertificatesPending(params);
  },
  certificateValidation: async (id: number) => {
    const response = await api.post<ResponseType<Certificate>>(
      `v1/pdt/certificate-validation/${id}`
    );
    return response.data;
  },
  decryptCertificate: async (
    transactionHash: string,
    publicKeyBase64: string
  ) => {
    const response = await api.post<{
      studentName: string;
      university: string;
      createdAt: string;
      diplomaNumber: string;
      ipfsUrl: string;
    }>(`v1/verify/decrypt`, {
      transactionHash,
      publicKeyBase64,
    });
    return response.data;
  },
  confirmCertificateByIds: async (ids: number[]) => {
    const response = await api.post(`v1/pdt/confirm-certificate-list`, {
      ids,
    });
    return response.data;
  },
  rejectCertificate: async (id: number) => {
    const response = await api.post(`v1/pdt/certificate-rejected/${id}`);
    return response.data;
  },

  // GET /api/v1/student/certificate-list
  listStudentCertificates: async (params?: {
    page?: number;
    size?: number;
    diplomaNumber?: string;
  }) => {
    const response = await api.get("/v1/student/certificate-list", { params });
    return response.data;
  },
  exportCertificates: async (type: ExportTypeCertificate) => {
    const response = await api.get("v1/pdt/export-certificates", {
      responseType: "blob",
      params: { type },
    });
    // Lấy fileName từ header nếu có
    let fileName = "certificates_all.xlsx";
    const disposition = response.headers["content-disposition"];
    if (disposition) {
      const match = disposition.match(/filename="?([^";]+)"?/);
      if (match) fileName = decodeURIComponent(match[1]);
    }
    return { fileName, blob: response.data };
  },
  rejectListCertificates: async (ids: Array<number>) => {
    const response = await api.post("v1/pdt/reject-a-list-of-certificate", {
      ids,
    });
    return response.data;
  },
  deleteListCertificates: async (ids: Array<number>) => {
    const response = await api.delete("v1/khoa/delete-certificate-list", {
      data: { ids },
    });
    return response.data;
  },
  deleteCertificate: async (id: number) => {
    const response = await api.delete(`v1/khoa/delete-certificate/${id}`);
    return response.data;
  },
};
