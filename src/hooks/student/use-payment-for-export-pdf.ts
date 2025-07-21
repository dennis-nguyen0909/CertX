import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

/**
 * Custom hook to handle payment and export PDF for a student.
 * Calls the backend endpoint to export a student's certificate as PDF.
 * @returns {Mutation} - React Query mutation object.
 */
export function usePaymentForExportPdf() {
  const { StudentService } = useServices();

  return useMutation({
    mutationKey: ["student-export-pdf"],
    mutationFn: async (studentId: string) => {
      return StudentService.studentExportPDF(studentId);
    },
  });
}
