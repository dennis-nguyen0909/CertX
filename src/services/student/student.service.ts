import { ResponseType } from "@/types/response";
import { api } from "../config/axios";
import { Student } from "@/models/student";
import { PaginatedListResponse } from "@/models/common";
import { transformPaginatedList } from "@/utils/pagination";
import { Class } from "@/models/class";

export const StudentService = {
  // Get list of students from university (PDT role)
  getStudentsOfUniversity: async (
    pageIndex: number,
    pageSize: number,
    name?: string,
    className?: string,
    departmentName?: string,
    sort?: string[],
    studentCode?: string
  ) => {
    const response = await api.get<PaginatedListResponse<Student>>(
      "/v1/pdt/students-of-university",
      {
        params: {
          page: pageIndex + 1,
          size: pageSize,
          studentName: name,
          className,
          studentCode,
          departmentName,
          sort,
        },
      }
    );
    return transformPaginatedList(response.data);
  },

  // Get list of students (Khoa role)
  getStudentsList: async (
    pageIndex: number,
    pageSize: number,
    name?: string,
    className?: string,
    sort?: string[],
    studentCode?: string
  ) => {
    const response = await api.get<PaginatedListResponse<Student>>(
      "/v1/khoa/list-students",
      {
        params: {
          page: pageIndex + 1,
          size: pageSize,
          studentName: name,
          className,
          sort,
          studentCode,
        },
      }
    );
    return transformPaginatedList(response.data);
  },
  getStudentsListCoin: async (
    pageIndex: number,
    pageSize: number,
    name?: string,
    className?: string,
    sort?: string[],
    studentCode?: string,
    departmentName?: string
  ) => {
    const response = await api.get<PaginatedListResponse<Student>>(
      "/v1/khoa/list-students-coin",
      {
        params: {
          page: pageIndex + 1,
          size: pageSize,
          studentName: name,
          className,
          sort,
          studentCode,
          departmentName,
        },
      }
    );
    return transformPaginatedList(response.data);
  },

  // Create a new student
  create: async (
    name: string,
    className: string,
    departmentName: string,
    studentCode: string,
    email: string,
    birthDate: string,
    course: string
  ) => {
    const response = await api.post<ResponseType<Student>>(
      "/v1/pdt/create-student",
      {
        name,
        classId: className,
        departmetnId: departmentName,
        studentCode,
        email,
        birthDate,
        course,
      }
    );
    return response.data;
  },

  // Create students from Excel file
  createFromExcel: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<
      ResponseType<{
        success: number;
        failed: number;
        errors?: string[];
      }>
    >("/v1/pdt/create-student-excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update student by ID
  update: async (
    id: number,
    name: string,
    className: string,
    departmentName: string,
    studentCode: string,
    email: string,
    birthDate: string,
    course: string
  ) => {
    const response = await api.put<ResponseType<Student>>(
      `/v1/pdt/update-student/${id}`,
      {
        name,
        classId: className,
        departmentId: departmentName,
        studentCode,
        email,
        birthDate,
        course,
      }
    );
    return response;
  },

  // Get student details by ID
  getById: async (id: number) => {
    const response = await api.get<Student>(`/v1/detail-student/${id}`);
    return response.data;
  },

  // Delete student by ID
  delete: async (id: string) => {
    const response = await api.delete<ResponseType<Student>>(
      `/v1/pdt/delete-student/${id}`
    );
    return response.data;
  },

  // Get departments of a specific class
  getDepartmentOfClass: async (classId?: number) => {
    const response = await api.get<{ id: number; name: string }>(
      "/v1/pdt/get-department-of-class",
      {
        params: classId ? { classId: classId.toString() } : undefined,
      }
    );
    return response.data;
  },

  // Get classes of a specific department
  getClassOfDepartment: async (
    departmentId?: string,
    pageIndex?: number,
    pageSize?: number,
    name?: string
  ) => {
    const response = await api.get<PaginatedListResponse<Class>>(
      "/v1/pdt/get-class-of-department",
      {
        params: departmentId
          ? {
              departmentId,
              page: pageIndex,
              size: pageSize,
              name,
            }
          : undefined,
      }
    );
    return transformPaginatedList(response.data);
  },

  // Bulk delete students
  bulkDeleteStudents: async (ids: number[]) => {
    const response = await api.delete<{ deletedCount: number }>(
      "v1/pdt/bulk-delete-students",
      {
        data: { ids },
      }
    );
    return response;
  },

  // Search students with advanced filters
  searchStudents: async (searchParams: {
    query?: string;
    className?: string;
    departmentName?: string;
    course?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await api.get<PaginatedListResponse<Student>>(
      "v1/pdt/search-students",
      {
        params: {
          page: searchParams.page ?? 1,
          size: searchParams.size ?? 10,
          ...searchParams,
        },
      }
    );
    return response.data;
  },

  // Export students to Excel
  exportStudentsToExcel: async (filters?: {
    className?: string;
    departmentName?: string;
    course?: string;
  }) => {
    const response = await api.get("v1/pdt/export-students-excel", {
      params: filters,
      responseType: "blob",
    });
    return response;
  },

  // Get student statistics
  getStudentStatistics: async () => {
    const response = await api.get<{
      totalStudents: number;
      totalDepartments: number;
      totalClasses: number;
      studentsByDepartment: Array<{
        departmentName: string;
        count: number;
      }>;
      studentsByCourse: Array<{
        course: string;
        count: number;
      }>;
    }>("v1/pdt/student-statistics");
    return response.data;
  },
  /**
   * Export a student's certificate as PDF.
   * @param studentId - The ID of the student to export PDF for.
   * @returns {Promise<Blob>} - The PDF file as a Blob.
   */
  studentExportPDF: async () => {
    const response = await api.post("v1/student/payments/pdf");
    return response.data;
  },
};
