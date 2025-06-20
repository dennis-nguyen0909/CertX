import { api } from "../config/axios";
import { Degree, DegreeTitle } from "../../models/degree";
import { PaginatedListResponse } from "@/models/common";

export interface DegreeSearchParams {
  page?: number;
  size?: number;
  departmentName?: string;
  className?: string;
  studentCode?: string;
  studentName?: string;
  graduationYear?: string;
}

export interface CreateDegreeRequest {
  studentId: number;
  ratingId: number;
  degreeTitleId: number;
  educationModeId: number;
  issueDate: string;
  graduationYear: string;
  trainingLocation: string;
  signer: string;
  diplomaNumber: string;
  lotteryNumber: string;
}

export const DegreeService = {
  // PUT v1/khoa/update-degree/{id}
  updateDegree: async (id: number, data: Partial<Degree>) => {
    const response = await api.put(`v1/khoa/update-degree/${id}`, data);
    return response.data;
  },

  // POST v1/pdt/degree-validation/{id}
  validateDegree: async (id: number) => {
    const response = await api.post(`v1/pdt/degree-validation/${id}`);
    return response.data;
  },

  // POST v1/pdt/confirm-degree-list
  confirmDegreeList: async (degreeIds: number[]) => {
    const response = await api.post("v1/pdt/confirm-degree-list", {
      ids: degreeIds,
    });
    return response.data;
  },

  // POST v1/khoa/degree/create
  createDegree: async (data: CreateDegreeRequest) => {
    const response = await api.post("v1/khoa/degree/create", data);
    return response.data;
  },

  // POST v1/khoa/degree/create-excel
  createDegreeFromExcel: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("v1/khoa/degree/create-excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // GET v1/pdt/list-degree
  getPDTDegreeList: async ({
    page = 1,
    size = 10,
    departmentName,
    className,
    studentCode,
    studentName,
    graduationYear,
  }: DegreeSearchParams = {}): Promise<PaginatedListResponse<Degree>> => {
    const response = await api.get<PaginatedListResponse<Degree>>(
      "v1/pdt/list-degree",
      {
        params: {
          page,
          size,
          departmentName,
          className,
          studentCode,
          studentName,
          graduationYear,
        },
      }
    );
    return response.data;
  },

  // GET v1/pdt/list-degree-pending
  getPDTPendingDegreeList: async ({
    page = 1,
    size = 10,
    departmentName,
    className,
    studentCode,
    studentName,
    graduationYear,
  }: DegreeSearchParams = {}): Promise<PaginatedListResponse<Degree>> => {
    const response = await api.get<PaginatedListResponse<Degree>>(
      "v1/pdt/list-degree-pending",
      {
        params: {
          page,
          size,
          departmentName,
          className,
          studentCode,
          studentName,
          graduationYear,
        },
      }
    );
    return response.data;
  },

  // GET v1/khoa/list-degree
  getKhoaDegreeList: async ({
    page = 1,
    size = 10,
    departmentName,
    className,
    studentCode,
    studentName,
    graduationYear,
  }: DegreeSearchParams = {}): Promise<PaginatedListResponse<Degree>> => {
    const response = await api.get<PaginatedListResponse<Degree>>(
      "v1/khoa/list-degree",
      {
        params: {
          page,
          size,
          departmentName,
          className,
          studentCode,
          studentName,
          graduationYear,
        },
      }
    );
    return response.data;
  },

  // GET v1/khoa/list-degree-pending
  getKhoaPendingDegreeList: async ({
    page = 1,
    size = 10,
    departmentName,
    className,
    studentCode,
    studentName,
    graduationYear,
  }: DegreeSearchParams = {}): Promise<PaginatedListResponse<Degree>> => {
    const response = await api.get<PaginatedListResponse<Degree>>(
      "v1/khoa/list-degree-pending",
      {
        params: {
          page,
          size,
          departmentName,
          className,
          studentCode,
          studentName,
          graduationYear,
        },
      }
    );
    return response.data;
  },

  // GET v1/admin/list-degree
  getAdminDegreeList: async ({
    page = 1,
    size = 10,
    departmentName,
    className,
    studentCode,
    studentName,
    graduationYear,
  }: DegreeSearchParams = {}): Promise<PaginatedListResponse<Degree>> => {
    const response = await api.get<PaginatedListResponse<Degree>>(
      "v1/admin/list-degree",
      {
        params: {
          page,
          size,
          departmentName,
          className,
          studentCode,
          studentName,
          graduationYear,
        },
      }
    );
    return response.data;
  },
  getListDegreeTitle: async ({
    page = 1,
    size = 10,
  }: { page?: number; size?: number } = {}): Promise<
    PaginatedListResponse<DegreeTitle>
  > => {
    const response = await api.get<PaginatedListResponse<DegreeTitle>>(
      "v1/khoa/degree-title",
      {
        params: { page, size },
      }
    );
    return response.data;
  },
  getDegreeDetail: async (id: number) => {
    const response = await api.get<Degree>(`v1/degree-detail/${id}`);
    return response.data;
  },
  verifyDegree: async (ipfsUrl: string) => {
    const response = await api.get<Degree>(`v1/verify`, {
      params: { ipfsUrl, type: "degree" },
    });
    return response;
  },
  decryptDegree: async (transactionHash: string, publicKeyBase64: string) => {
    const response = await api.post(`v1/verify/decrypt`, {
      transactionHash,
      publicKeyBase64,
    });
    return response.data;
  },
};
