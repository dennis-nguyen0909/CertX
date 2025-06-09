"use client";

import type React from "react";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader, Search, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import CertXLogo from "../../../../public/logos/certx_logo.png";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useCertificatesVerify } from "@/hooks/certificates/use-certificates-verify";
import { Certificate } from "@/models/certificate";

// Extended certificate interface with additional blockchain fields
interface ExtendedCertificate extends Certificate {
  ipfsUrl?: string;
  transactionHash?: string;
  diplomaNumber?: string;
}

// Form schema
const certificateVerifySchema = z.object({
  input: z.string().min(1, "Vui lòng nhập URL hoặc Public ID"),
});

type CertificateVerifyFormData = z.infer<typeof certificateVerifySchema>;

interface CertificateVerifyFormProps
  extends React.ComponentPropsWithoutRef<"div"> {
  initialValue?: string;
}

export function CertificateVerifyForm({
  className,
  initialValue = "",
  ...props
}: CertificateVerifyFormProps) {
  const [verificationResult, setVerificationResult] = useState<
    "valid" | "invalid" | null
  >(null);
  const [publicKey, setPublicKey] = useState("");
  const [dataToDecrypt, setDataToDecrypt] = useState("");
  const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const {
    mutate: verifyCertificate,
    isPending,
    data: certificateResponse,
  } = useCertificatesVerify();

  const form = useForm<CertificateVerifyFormData>({
    resolver: zodResolver(certificateVerifySchema),
    defaultValues: {
      input: initialValue,
    },
  });

  // Update form when initialValue changes
  useEffect(() => {
    if (initialValue) {
      form.setValue("input", initialValue);
    }
  }, [initialValue, form]);

  const handleVerify = async (data: CertificateVerifyFormData) => {
    setVerificationResult(null);

    verifyCertificate(data.input, {
      onSuccess: (response) => {
        console.log("response", response);
        setVerificationResult("valid");
        toast.success("Chứng chỉ hợp lệ!");
      },
      onError: () => {
        setVerificationResult("invalid");
        toast.error("Không thể xác thực chứng chỉ");
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleDecrypt = async () => {
    if (!publicKey.trim() || !dataToDecrypt.trim()) {
      toast.error("Vui lòng nhập đầy đủ Public Key và Data");
      return;
    }

    try {
      setIsDecrypting(true);
      setDecryptedResult(null);

      // TODO: Implement actual decryption logic here
      // For now, simulate a decryption process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock decrypted result
      const mockDecryptedData =
        "Decrypted data: Student information verified successfully";
      setDecryptedResult(mockDecryptedData);
      toast.success("Giải mã thành công!");
    } catch (error) {
      console.error("Decryption failed:", error);
      toast.error("Không thể giải mã dữ liệu");
    } finally {
      setIsDecrypting(false);
    }
  };

  console.log("certificateResponse", certificateResponse);
  return (
    <div
      className={cn("w-full max-w-4xl mx-auto space-y-6", className)}
      {...props}
    >
      <motion.div
        className="flex justify-center mb-8"
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

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Card className="border shadow-lg bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black">
              Xác thực chứng chỉ
            </CardTitle>
            <CardDescription className="text-gray-700">
              Nhập URL chứng chỉ hoặc Public ID để xác thực
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleVerify)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        URL hoặc Public ID
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Nhập URL chứng chỉ hoặc Public ID..."
                            className="pl-10 h-12 text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Xác thực chứng chỉ
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {verificationResult && (
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

            {certificateResponse?.data && verificationResult === "valid" && (
              <CardContent className="space-y-6">
                {certificateResponse.data.image_url && (
                  <div className="flex justify-center">
                    <img
                      src={certificateResponse.data.image_url}
                      alt="Certificate"
                      className="max-w-full h-auto border rounded-lg shadow-md"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Tên sinh viên
                      </label>
                      <p className="text-lg font-semibold text-black">
                        {certificateResponse.data.nameStudent}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Tên chứng chỉ
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.certificateName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Lớp học
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.studentClass}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Khoa
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.department}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Số bằng
                      </label>
                      <p className="text-base font-mono text-black">
                        {certificateResponse.data.diploma_number}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Ngày cấp
                      </label>
                      <p className="text-base text-black">
                        {formatDate(certificateResponse.data.issueDate)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Trạng thái
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            (certificateResponse.data.status || "verified") ===
                            "verified"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            (certificateResponse.data.status || "verified") ===
                            "verified"
                              ? "bg-black text-white"
                              : "bg-gray-200 text-black"
                          }
                        >
                          {(certificateResponse.data.status || "verified") ===
                          "verified"
                            ? "Đã xác thực"
                            : certificateResponse.data.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Đơn vị cấp
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.university}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Mã sinh viên
                      </label>
                      <p className="text-base font-mono text-black">
                        {certificateResponse.data.studentCode}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.email}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Ngày sinh
                      </label>
                      <p className="text-base text-black">
                        {formatDate(certificateResponse.data.birthDate)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Khóa học
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.course}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Người ký
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.signer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blockchain Information */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-black mb-4">
                    Thông tin Blockchain
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(certificateResponse.data as ExtendedCertificate)
                      .ipfsUrl && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          IPFS URL
                        </label>
                        <p className="text-sm font-mono text-black break-all">
                          {
                            (certificateResponse.data as ExtendedCertificate)
                              .ipfsUrl
                          }
                        </p>
                      </div>
                    )}
                    {(certificateResponse.data as ExtendedCertificate)
                      .transactionHash && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Transaction Hash
                        </label>
                        <p className="text-sm font-mono text-black break-all">
                          {
                            (certificateResponse.data as ExtendedCertificate)
                              .transactionHash
                          }
                        </p>
                      </div>
                    )}
                    {(certificateResponse.data as ExtendedCertificate)
                      .createdAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Ngày tạo
                        </label>
                        <p className="text-sm text-black">
                          {new Date(
                            (
                              certificateResponse.data as ExtendedCertificate
                            ).createdAt
                          ).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decryption Section for Employers */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-black mb-4">
                    Giải mã cho nhà tuyển dụng
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        Public Key
                      </label>
                      <Input
                        placeholder="Nhập public key..."
                        className="w-full"
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        Data cần giải mã
                      </label>
                      <Input
                        placeholder="Nhập data cần giải mã..."
                        className="w-full"
                        value={dataToDecrypt}
                        onChange={(e) => setDataToDecrypt(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                      onClick={handleDecrypt}
                      disabled={isDecrypting}
                    >
                      {isDecrypting ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Đang giải mã...
                        </>
                      ) : (
                        "Giải mã"
                      )}
                    </Button>

                    {/* Decrypted Result */}
                    {decryptedResult && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <label className="text-sm font-medium text-green-800 block mb-2">
                          Kết quả giải mã:
                        </label>
                        <p className="text-sm text-green-900 break-all">
                          {decryptedResult}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code */}
                {certificateResponse.data.qrCodeUrl && (
                  <div className="flex justify-center pt-4 border-t">
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        Mã QR
                      </label>
                      <img
                        src={certificateResponse.data.qrCodeUrl}
                        alt="QR Code"
                        width="150"
                        height="150"
                        className="mx-auto border rounded-lg"
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
  );
}
