import type { PaginatedListResponse } from "@/models/common";
import type {
  Certificate,
  CreateCertificateRequest,
  UpdateCertificateRequest,
} from "@/models/certificates";
import { transformPaginatedList } from "@/utils/pagination";

// Mock data
const mockCertificates: Certificate[] = [
  {
    id: "1",
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issueDate: "2023-01-01",
    expiryDate: "2026-01-01",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Google Cloud Professional",
    issuer: "Google",
    issueDate: "2023-02-01",
    expiryDate: "2026-02-01",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Microsoft Azure Administrator",
    issuer: "Microsoft",
    issueDate: "2023-03-01",
    expiryDate: "2026-03-01",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const CertificateService = {
  find: async (params: {
    page?: number;
    limit?: number;
    sort?: string[];
    name?: string;
  }) => {
    await delay(500); // Simulate network delay

    let filteredCertificates = [...mockCertificates];

    // Apply name filter if provided
    if (params.name) {
      filteredCertificates = filteredCertificates.filter((certificate) =>
        certificate.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCertificates = filteredCertificates.slice(
      startIndex,
      endIndex
    );

    const mockResponse: PaginatedListResponse<Certificate> = {
      items: paginatedCertificates,
      meta: {
        total: filteredCertificates.length,
        count: paginatedCertificates.length,
        per_page: limit,
        current_page: page,
        total_pages: Math.ceil(filteredCertificates.length / limit),
      },
    };

    return transformPaginatedList(mockResponse);
  },

  create: async (data: CreateCertificateRequest) => {
    await delay(500);
    const newCertificate: Certificate = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCertificates.push(newCertificate);
    return newCertificate;
  },

  update: async (data: UpdateCertificateRequest) => {
    await delay(500);
    const index = mockCertificates.findIndex(
      (certificate) => certificate.id === data.id
    );
    if (index === -1) {
      throw new Error("Certificate not found");
    }
    const updatedCertificate: Certificate = {
      ...mockCertificates[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockCertificates[index] = updatedCertificate;
    return updatedCertificate;
  },

  delete: async (id: string) => {
    await delay(500);
    const index = mockCertificates.findIndex(
      (certificate) => certificate.id === id
    );
    if (index === -1) {
      throw new Error("Certificate not found");
    }
    mockCertificates.splice(index, 1);
    return undefined;
  },

  get: async (id: string) => {
    await delay(500);
    const certificate = mockCertificates.find(
      (certificate) => certificate.id === id
    );
    if (!certificate) {
      throw new Error("Certificate not found");
    }
    return certificate;
  },
};
