import ClassStudentsPage from "@/containers/class-students-page";

interface PageProps {
  params: {
    className: string;
    locale: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ClassStudentsPage className={decodeURIComponent(params.className)} />;
}
