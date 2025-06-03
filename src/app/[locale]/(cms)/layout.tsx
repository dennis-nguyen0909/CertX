import Providers from "../../providers";
import { AuthRedirect } from "@/components/auth-redirect";
import { Toaster } from "sonner";

export default async function CMSLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <Providers locale={locale}>
      <AuthRedirect>{children}</AuthRedirect>
      <Toaster position="top-right" />
    </Providers>
  );
}
