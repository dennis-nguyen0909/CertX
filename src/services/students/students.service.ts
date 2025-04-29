import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
} from "@/models/students";
import type { PaginatedListResponse } from "@/models/common";
import { transformPaginatedList } from "@/utils/pagination";

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Student 1",
    email: "student1@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Student 2",
    email: "student2@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Student 3",
    email: "student3@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const StudentService = {
  find: async (params: {
    page?: number;
    limit?: number;
    sort?: string[];
    name?: string;
  }) => {
    await delay(500); // Simulate network delay

    let filteredStudents = [...mockStudents];

    // Apply name filter if provided
    if (params.name) {
      filteredStudents = filteredStudents.filter((student) =>
        student.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    const mockResponse: PaginatedListResponse<Student> = {
      items: paginatedStudents,
      meta: {
        total: filteredStudents.length,
        count: paginatedStudents.length,
        per_page: limit,
        current_page: page,
        total_pages: Math.ceil(filteredStudents.length / limit),
      },
    };

    return transformPaginatedList(mockResponse);
  },

  create: async (data: CreateStudentRequest) => {
    await delay(500);
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStudents.push(newStudent);
    return newStudent;
  },

  update: async (data: UpdateStudentRequest) => {
    await delay(500);
    const index = mockStudents.findIndex((student) => student.id === data.id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    const updatedStudent: Student = {
      ...mockStudents[index],
      name: data.name,
      updatedAt: new Date().toISOString(),
    };
    mockStudents[index] = updatedStudent;
    return updatedStudent;
  },

  delete: async (id: string) => {
    await delay(500);
    const index = mockStudents.findIndex((student) => student.id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    mockStudents.splice(index, 1);
    return undefined;
  },

  get: async (id: string) => {
    await delay(500);
    const student = mockStudents.find((student) => student.id === id);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  },
};
