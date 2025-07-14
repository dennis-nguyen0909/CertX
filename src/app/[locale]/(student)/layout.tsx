import StudentTopbar from "@/components/student-topbar";
import Providers from "../../providers";
import { Toaster } from "sonner";
import { AuthStudentRedirect } from "@/components/auth-redirect";

export default async function StudentLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <Providers locale={locale}>
      <div className="flex flex-col min-h-screen">
        <StudentTopbar />
        <main className="flex-1">
          <AuthStudentRedirect>{children}</AuthStudentRedirect>
        </main>
      </div>
      <Toaster position="top-right" />
    </Providers>
  );
}
