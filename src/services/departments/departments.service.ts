import {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/models/departments";

// Mock data for departments
const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Computer Science",
    code: "CS",
    description: "Department of Computer Science",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Information Technology",
    code: "IT",
    description: "Department of Information Technology",
    status: "active",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-02-01T00:00:00Z",
  },
];

export class DepartmentService {
  static async find(params: {
    pageIndex?: number;
    pageSize?: number;
    name?: string;
    sort?: string[];
  }): Promise<{
    items: Department[];
    meta: {
      total: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
    };
  }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredDepartments = [...mockDepartments];

    // Filter by name if provided
    if (params.name) {
      filteredDepartments = filteredDepartments.filter((dept) =>
        dept.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }

    // Sort if provided
    if (params.sort && params.sort.length > 0) {
      const [field, direction] = params.sort[0].split(":");
      filteredDepartments.sort((a, b) => {
        const aValue = a[field as keyof Department];
        const bValue = b[field as keyof Department];
        if (direction === "desc") {
          return (bValue ?? "") > (aValue ?? "") ? 1 : -1;
        }
        return (aValue ?? "") > (bValue ?? "") ? 1 : -1;
      });
    }

    // Pagination
    const pageIndex = params.pageIndex || 0;
    const pageSize = params.pageSize || 10;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paginatedDepartments = filteredDepartments.slice(start, end);

    return {
      items: paginatedDepartments,
      meta: {
        total: filteredDepartments.length,
        totalPages: Math.ceil(filteredDepartments.length / pageSize),
        currentPage: pageIndex + 1,
        perPage: pageSize,
      },
    };
  }

  static async create(data: CreateDepartmentRequest): Promise<Department> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newDepartment: Department = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDepartments.push(newDepartment);
    return newDepartment;
  }

  static async update(data: UpdateDepartmentRequest): Promise<Department> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockDepartments.findIndex((dept) => dept.id === data.id);
    if (index === -1) {
      throw new Error("Department not found");
    }

    const updatedDepartment: Department = {
      ...mockDepartments[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockDepartments[index] = updatedDepartment;
    return updatedDepartment;
  }

  static async delete(id: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockDepartments.findIndex((dept) => dept.id === id);
    if (index === -1) {
      throw new Error("Department not found");
    }

    mockDepartments.splice(index, 1);
  }

  static async get(id: string): Promise<Department> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const department = mockDepartments.find((dept) => dept.id === id);
    if (!department) {
      throw new Error("Department not found");
    }

    return department;
  }
}
