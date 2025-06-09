"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import CertXLogo from "../../../public/logos/certx_logo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Mock certificate data - Replace with actual API call
interface CertificateData {
  id: number;
  nameStudent: string;
  className: string;
  department: string;
  issueDate: string;
  diploma_number: string;
  certificateName: string;
  birthDate: string;
  course: string;
  email: string;
  grantor: string;
  image_url: string;
  qrCodeUrl: string;
  signer: string;
  studentClass: string;
  studentCode: string;
  university: string;
  status: string;
  isValid: boolean;
}

interface Props {
  publicId: string;
}

export default function CertificateVerifyWithIdPage({ publicId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);
  const [verificationResult, setVerificationResult] = useState<
    "valid" | "invalid" | null
  >(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        setIsLoading(true);

        // Mock API call - Replace with actual API endpoint
        // For now, simulate a successful verification
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Verifying certificate with publicId:", publicId);

        // Mock successful response
        const mockCertificate: CertificateData = {
          id: 1,
          nameStudent: "Nguyễn Văn A",
          className: "CNTT2023",
          department: "Khoa Công nghệ thông tin",
          issueDate: "2024-01-15",
          diploma_number: "DIP001234",
          certificateName: "Chứng chỉ Công nghệ thông tin",
          birthDate: "1995-05-20",
          course: "Khóa học Công nghệ thông tin",
          email: "nguyenvana@email.com",
          grantor: "Trường Đại học ABC",
          image_url:
            "https://via.placeholder.com/600x400/4f46e5/ffffff?text=Certificate",
          qrCodeUrl:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
          signer: "Hiệu trưởng Trần Văn B",
          studentClass: "CNTT2023",
          studentCode: "SV001234",
          university: "Trường Đại học ABC",
          status: "verified",
          isValid: true,
        };

        setCertificateData(mockCertificate);
        setVerificationResult("valid");
        toast.success("Chứng chỉ hợp lệ!");
      } catch (error) {
        console.error("Verification failed:", error);
        setVerificationResult("invalid");
        toast.error("Không thể xác thực chứng chỉ");
      } finally {
        setIsLoading(false);
      }
    };

    if (publicId) {
      verifyCertificate();
    }
  }, [publicId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleBackToVerify = () => {
    router.push("/verify-certificate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src={CertXLogo}
              alt="CertX Logo"
              width={180}
              height={60}
              priority
            />
          </motion.div>

          <h1 className="text-3xl font-bold text-black sm:text-4xl">
            Kết quả xác thực chứng chỉ
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Public ID:{" "}
            <span className="font-mono font-medium text-black">{publicId}</span>
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToVerify}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang xác thực
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Card className="border shadow-lg bg-white">
              <CardContent className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin mr-3" />
                <span className="text-lg text-black">
                  Đang xác thực chứng chỉ...
                </span>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Verification Result */}
        {!isLoading && verificationResult && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Card className="border shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {verificationResult === "valid" ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span className="text-black font-semibold">
                        ✓ Chứng chỉ hợp lệ
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-600" />
                      <span className="text-black font-semibold">
                        ✗ Chứng chỉ không hợp lệ
                      </span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>

              {certificateData && verificationResult === "valid" && (
                <CardContent className="space-y-6">
                  {/* Certificate Image */}
                  {certificateData.image_url && (
                    <div className="flex justify-center">
                      <Image
                        src={certificateData.image_url}
                        alt="Certificate"
                        className="max-w-full h-auto border rounded-lg shadow-md"
                        width={600}
                        height={400}
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Certificate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Tên sinh viên
                        </label>
                        <p className="text-lg font-semibold text-black">
                          {certificateData.nameStudent}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Tên chứng chỉ
                        </label>
                        <p className="text-base text-black">
                          {certificateData.certificateName}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Lớp học
                        </label>
                        <p className="text-base text-black">
                          {certificateData.className}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Khoa
                        </label>
                        <p className="text-base text-black">
                          {certificateData.department}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Số bằng
                        </label>
                        <p className="text-base font-mono text-black">
                          {certificateData.diploma_number}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Ngày cấp
                        </label>
                        <p className="text-base text-black">
                          {formatDate(certificateData.issueDate)}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Trạng thái
                        </label>
                        <div className="mt-1">
                          <Badge
                            variant={
                              certificateData.status === "verified"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              certificateData.status === "verified"
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black"
                            }
                          >
                            {certificateData.status === "verified"
                              ? "Đã xác thực"
                              : certificateData.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Đơn vị cấp
                        </label>
                        <p className="text-base text-black">
                          {certificateData.university}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  {certificateData.qrCodeUrl && (
                    <div className="flex justify-center pt-4 border-t">
                      <div className="text-center">
                        <label className="text-sm font-medium text-gray-600 block mb-2">
                          Mã QR
                        </label>
                        <Image
                          src={certificateData.qrCodeUrl}
                          alt="QR Code"
                          width={150}
                          height={150}
                          className="mx-auto border rounded-lg"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
