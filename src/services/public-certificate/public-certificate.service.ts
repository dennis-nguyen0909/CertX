import { api } from "../config/axios";

export interface PublicCertificateData {
  id: number;
  nameStudent: string;
  className: string;
  department: string;
  issueDate: string;
  diploma_number: string;
  certificateName: string;
  birthDate: string;
  course: string;
  email: string;
  grantor: string;
  image_url: string;
  qrCodeUrl: string;
  signer: string;
  studentClass: string;
  studentCode: string;
  university: string;
  status: string;
  isValid: boolean;
}

export interface PublicCertificateVerificationResponse {
  status: number;
  message: string;
  data: PublicCertificateData | null;
  isValid: boolean;
}

export const PublicCertificateService = {
  // GET /api/v1/public/verify-certificate/{publicId}
  verifyByPublicId: async (publicId: string) => {
    const response = await api.get<PublicCertificateVerificationResponse>(
      `/api/v1/public/verify-certificate/${publicId}`
    );
    return response.data;
  },

  // GET /api/v1/public/verify-certificate-by-input
  verifyByInput: async (input: string) => {
    const response = await api.get<PublicCertificateVerificationResponse>(
      "/api/v1/public/verify-certificate-by-input",
      {
        params: { input },
      }
    );
    return response.data;
  },
};
