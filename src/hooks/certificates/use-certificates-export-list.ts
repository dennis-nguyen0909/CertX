// import { useMutation } from "@tanstack/react-query";
// import { useServices } from "@/services";
// import { ExportTypeCertificate } from "@/models/certificate";

// export function useExportCertificatesList() {
//   const { CertificatesService } = useServices();

//   return useMutation({
//     mutationKey: ["certificates-export-list"],
//     mutationFn: (type: ExportTypeCertificate, ids: number[]) =>
//       CertificatesService.exportCertificatesList(type, ids),
//   });
// }
