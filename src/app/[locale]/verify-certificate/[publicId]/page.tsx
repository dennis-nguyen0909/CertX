import CertificateVerifyWithIdPage from "@/containers/certificate-verify-with-id-page";

export default function Page({ params }: { params: { publicId: string } }) {
  return <CertificateVerifyWithIdPage publicId={params.publicId} />;
}
