import { HeaderLocaleSwitcher } from "@/components/header-locale-switcher";
import Providers from "../../providers";

export default async function AuthLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <Providers locale={locale}>
      {" "}
      <div className="flex justify-end pr-4 pt-4">
        <HeaderLocaleSwitcher />
      </div>
      {children}
    </Providers>
  );
}
