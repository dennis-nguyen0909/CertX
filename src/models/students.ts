export interface Student {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
}

export interface UpdateStudentRequest {
  id: string;
  name: string;
  email: string;
}
