import CertificateVerifyWithIdPage from "@/containers/certificate-verify-with-id-page";

export default async function Page({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  return <CertificateVerifyWithIdPage publicId={publicId} />;
}
