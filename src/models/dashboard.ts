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
  degreePending: number;
  degreeApproved: number;
  degreeRejected: number;
  certificatePending: number;
  certificateApproved: number;
  certificateRejected: number;
}
