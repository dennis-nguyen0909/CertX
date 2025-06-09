import ClassStudentsPage from "@/containers/class-students-page";

interface PageProps {
  params: Promise<{
    className: string;
    locale: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { className } = await params;
  return <ClassStudentsPage className={decodeURIComponent(className)} />;
}
