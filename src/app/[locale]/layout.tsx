import Providers from "../providers";
import { Toaster } from "sonner";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <Providers locale={locale}>
      {children}
      <Toaster position="top-right" />
    </Providers>
  );
}
