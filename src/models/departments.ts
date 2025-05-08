export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  status: string;
}

export interface UpdateDepartmentRequest {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
}
