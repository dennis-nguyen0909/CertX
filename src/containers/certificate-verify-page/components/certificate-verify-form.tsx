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
import STULogo from "../../../../public/logos/Logo_STU.png";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useCertificatesVerify } from "@/hooks/certificates/use-certificates-verify";
import { useCertificatesDecrypt } from "@/hooks/certificates/use-certificates-decrypt";
import { Certificate } from "@/models/certificate";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Extended certificate interface with additional blockchain fields
interface ExtendedCertificate extends Certificate {
  ipfsUrl?: string;
  transactionHash?: string;
}

interface CertificateVerifyFormProps
  extends React.ComponentPropsWithoutRef<"div"> {
  initialValue?: string;
}

export function CertificateVerifyForm({
  className,
  initialValue = "",
  ...props
}: CertificateVerifyFormProps) {
  const { t } = useTranslation();

  // Form schema with dynamic validation message
  const certificateVerifySchema = z.object({
    input: z.string().min(1, t("certificateVerify.form.inputValidation")),
  });

  type CertificateVerifyFormData = z.infer<typeof certificateVerifySchema>;

  const [verificationResult, setVerificationResult] = useState<
    "valid" | "invalid" | null
  >(null);
  const [publicKey, setPublicKey] = useState("");
  const {
    mutate: verifyCertificate,
    isPending,
    data: certificateResponse,
  } = useCertificatesVerify();

  // Get transaction hash for decryption
  const transactionHash =
    (certificateResponse?.data as ExtendedCertificate)?.transactionHash || "";

  // Initialize decryption hook
  const {
    mutate: decryptCertificate,
    isPending: isDecrypting,
    error: decryptionError,
    data: decryptedResult,
  } = useCertificatesDecrypt(transactionHash, publicKey);

  const form = useForm<CertificateVerifyFormData>({
    resolver: zodResolver(certificateVerifySchema),
    defaultValues: {
      input: initialValue,
    },
  });
  const { userDetail } = useSelector((state: RootState) => state.user);
  // Update form when initialValue changes
  console.log("userDetail", userDetail);
  useEffect(() => {
    if (initialValue) {
      form.setValue("input", initialValue);
    }
  }, [initialValue, form]);

  // Auto-populate public key from userDetail
  useEffect(() => {
    if (userDetail?.publicKey) {
      setPublicKey(userDetail.publicKey);
    }
  }, [userDetail]);

  const handleVerify = async (data: CertificateVerifyFormData) => {
    setVerificationResult(null);

    verifyCertificate(data.input, {
      onSuccess: (response) => {
        console.log("response", response);
        setVerificationResult("valid");
        toast.success(t("certificateVerify.result.validToast"));
      },
      onError: () => {
        setVerificationResult("invalid");
        toast.error(t("certificateVerify.result.invalidToast"));
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleDecrypt = async () => {
    if (!publicKey.trim()) {
      toast.error(t("certificateVerify.decryption.validationError"));
      return;
    }

    if (!transactionHash) {
      toast.error(t("certificateVerify.decryption.transactionHashNotFound"));
      return;
    }

    decryptCertificate(undefined, {
      onSuccess: () => {
        toast.success(t("certificateVerify.decryption.successToast"));
      },
      onError: (error) => {
        console.error("Decryption failed:", error);
        toast.error(t("certificateVerify.decryption.errorToast"));
      },
    });
  };

  console.log("decryptedResult", decryptedResult);
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
        <Image priority src={STULogo} alt="STU Logo" width={64} height={64} />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Card className="border shadow-lg bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black">
              {t("certificateVerify.form.title")}
            </CardTitle>
            <CardDescription className="text-gray-700">
              {t("certificateVerify.form.description")}
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
                        {t("certificateVerify.form.inputLabel")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder={t(
                              "certificateVerify.form.inputPlaceholder"
                            )}
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
                      {t("certificateVerify.form.verifying")}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      {t("certificateVerify.form.verifyButton")}
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
                      {t("certificateVerify.result.valid")}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-600" />
                    <span className="text-black font-semibold">
                      {t("certificateVerify.result.invalid")}
                    </span>
                  </>
                )}
              </CardTitle>
            </CardHeader>

            {certificateResponse?.data && verificationResult === "valid" && (
              <CardContent className="space-y-6">
                {certificateResponse.data.image_url && (
                  <div className="flex justify-center">
                    <Image
                      src={certificateResponse.data.image_url}
                      alt="Certificate"
                      className="max-w-full h-auto border rounded-lg shadow-md"
                      width={600}
                      height={400}
                      unoptimized
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.studentName")}
                      </label>
                      <p className="text-lg font-semibold text-black">
                        {certificateResponse.data.nameStudent}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.certificateName")}
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.certificateName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.class")}
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.studentClass}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.department")}
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.department}
                      </p>
                    </div>
                    {/* QR Code */}
                    {certificateResponse.data.qrCodeUrl && (
                      <div className="flex justify-center pt-4 border-t">
                        <div className="text-center">
                          <label className="text-sm font-medium text-gray-600 block mb-2">
                            {t("certificateVerify.details.qrCode")}
                          </label>
                          <Image
                            src={
                              certificateResponse.data.qrCodeUrl.startsWith(
                                "data:"
                              )
                                ? certificateResponse.data.qrCodeUrl
                                : `data:image/png;base64,${certificateResponse.data.qrCodeUrl}`
                            }
                            alt="QR Code"
                            width={250}
                            height={250}
                            className="mx-auto border rounded-lg"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.diplomaNumber")}
                      </label>
                      <p className="text-base font-mono text-black">
                        {certificateResponse.data.diploma_number}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.issueDate")}
                      </label>
                      <p className="text-base text-black">
                        {formatDate(certificateResponse.data.issueDate)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.status")}
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
                            ? t("certificateVerify.details.verified")
                            : certificateResponse.data.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.issuingInstitution")}
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.university}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.studentCode")}
                      </label>
                      <p className="text-base font-mono text-black">
                        {certificateResponse.data.studentCode}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.email")}
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.email}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.birthDate")}
                      </label>
                      <p className="text-base text-black">
                        {formatDate(certificateResponse.data.birthDate)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.course")}
                      </label>
                      <p className="text-base text-black">
                        {certificateResponse.data.course}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t("certificateVerify.details.signer")}
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
                    {t("certificateVerify.blockchain.title")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(certificateResponse.data as ExtendedCertificate)
                      .ipfsUrl && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {t("certificateVerify.blockchain.ipfsUrl")}
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
                          {t("certificateVerify.blockchain.transactionHash")}
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
                          {t("certificateVerify.details.createdDate")}
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
                    {t("certificateVerify.decryption.title")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        {t("certificateVerify.decryption.publicKeyLabel")}
                      </label>
                      <Input
                        placeholder={t(
                          "certificateVerify.decryption.publicKeyPlaceholder"
                        )}
                        className="w-full"
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                      onClick={handleDecrypt}
                      disabled={isDecrypting || !transactionHash}
                    >
                      {isDecrypting ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          {t("certificateVerify.decryption.decrypting")}
                        </>
                      ) : (
                        t("certificateVerify.decryption.decryptButton")
                      )}
                    </Button>

                    {/* Decrypted Result */}
                    {decryptedResult &&
                      Object.keys(decryptedResult).length > 0 && (
                        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <label className="text-lg font-semibold text-blue-800">
                              {t("certificateVerify.decryption.resultLabel")}
                            </label>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {decryptedResult.studentName && (
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                  {t("certificateVerify.details.studentName")}
                                </label>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                  {decryptedResult.studentName}
                                </p>
                              </div>
                            )}

                            {decryptedResult.university && (
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                  {t(
                                    "certificateVerify.details.issuingInstitution"
                                  )}
                                </label>
                                <p className="text-sm text-gray-900 mt-1">
                                  {decryptedResult.university}
                                </p>
                              </div>
                            )}

                            {decryptedResult.diplomaNumber && (
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                  {t("certificateVerify.details.diplomaNumber")}
                                </label>
                                <p className="text-sm font-mono text-gray-900 mt-1">
                                  {decryptedResult.diplomaNumber}
                                </p>
                              </div>
                            )}

                            {decryptedResult.createdAt && (
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                  {t("certificateVerify.details.createdDate")}
                                </label>
                                <p className="text-sm text-gray-900 mt-1">
                                  {new Date(
                                    decryptedResult.createdAt
                                  ).toLocaleString("vi-VN")}
                                </p>
                              </div>
                            )}

                            {decryptedResult.ipfsUrl && (
                              <div className="bg-white p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                  {t("certificateVerify.blockchain.ipfsUrl")}
                                </label>
                                <p className="text-sm font-mono text-gray-900 mt-1 break-all">
                                  {decryptedResult.ipfsUrl}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Success Badge */}
                          <div className="mt-4 flex justify-center">
                            <Badge className="bg-blue-600 text-white px-4 py-2">
                              <div className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full mr-2">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              {t("certificateVerify.decryption.successMessage")}
                            </Badge>
                          </div>
                        </div>
                      )}

                    {/* Error Display */}
                    {decryptionError && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <label className="text-sm font-medium text-red-800 block mb-2">
                          Error
                        </label>
                        <p className="text-sm text-red-900">
                          {decryptionError?.message || "Decryption failed"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
