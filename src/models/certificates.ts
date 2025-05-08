export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateRequest {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: string;
}

export interface UpdateCertificateRequest {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: string;
}
