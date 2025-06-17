export interface Degree {
  id: number;
  nameStudent: string;
  className: string;
  department: string;
  issueDate: string;
  status: string;
  graduationYear: string;
  diplomaNumber: string;
  createdAt: string;
}

export interface DegreeListResponse {
  status: number;
  message: string;
  data: {
    items: Degree[];
    meta: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}
