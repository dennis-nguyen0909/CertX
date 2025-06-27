export interface Certificate {
  id: number;
  nameStudent: string;
  className: string;
  department: string;
  issueDate: string;
  diplomaNumber: string;
  certificateName: string;
  createdAt: string;
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
  status?: string;
  transactionHash?: string;
  ipfsUrl?: string;
  studentId: number;
  certificateTypeId: number;
  diploma_number: string;
}

export interface CertificateCreateRequest {
  studentId: number;
  certificateTypeId: number;
  grantor: string;
  signer: string;
  issueDate: string;
  diplomaNumber: string;
}

export interface CertificateUpdateRequest {
  studentId?: number;
  certificateTypeId?: number;
  grantor?: string;
  signer?: string;
  issueDate?: string;
  diplomaNumber?: string;
}

export interface CertificateSearchParams {
  page?: number;
  size?: number;
  nameStudent?: string;
  studentCode?: string;
  className?: string;
  department?: string;
  certificateName?: string;
  status?: string;
  grantor?: string;
  signer?: string;
  university?: string;
  course?: string;
  issueDate?: string;
  diplomaNumber?: string;
}

export interface CertificateListResponse {
  status: number;
  message: string;
  data: {
    items: Certificate[];
    meta: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}

export interface ExcelUploadResponse {
  success: boolean;
  message: string;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors?: string[];
}

export interface Student {
  id: number;
  name: string;
  className: string;
  department: string;
  email?: string;
  studentCode?: string;
}

export interface StudentSearchResponse {
  students: Student[];
  total: number;
}
