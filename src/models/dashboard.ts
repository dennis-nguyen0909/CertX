export interface DashboardPdtResponse {
  classCount: number;
  degreePending: number;
  degreeApproved: number;
  degreeRejected: number;
  studentCount: number;
  certificatePending: number;
  certificateApproved: number;
  certificateRejected: number;
  departmentCount: number;
}

export interface FacultyDegreeStatisticsResponse {
  departmentName: string;
  validatedDegreeCount: number;
  notValidatedDegreeCount: number;
  validatedCertificateCount: number;
  notValidatedCertificateCount: number;
}
