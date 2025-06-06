export interface Certificate {
  id: number;
  nameStudent: string;
  className: string;
  department: string;
  issueDate: string;
  diploma_number: string;
  certificateName: string;
  createdAt: string;
}

export interface CertificateCreateRequest {
  nameStudent: string;
  className: string;
  department: string;
  issueDate: string;
  diploma_number: string;
  certificateName: string;
}

export interface CertificateUpdateRequest {
  nameStudent?: string;
  className?: string;
  department?: string;
  issueDate?: string;
  diploma_number?: string;
  certificateName?: string;
}

export interface CertificateSearchParams {
  page?: number;
  size?: number;
  nameStudent?: string;
  className?: string;
  department?: string;
  certificateName?: string;
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
