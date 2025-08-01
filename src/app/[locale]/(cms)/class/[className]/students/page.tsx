"use client";
import ClassStudentsPage from "@/containers/class-students-page";
import { useClassDetailByName } from "@/hooks/class";
import { useEffect, useState, use } from "react";
import { Loader2 } from "lucide-react";
import { Class } from "@/models/class";

export default function Page({
  params,
}: {
  params: Promise<{ className: string }>;
}) {
  const { className } = use(params);
  const decodedClassName = decodeURIComponent(className);
  const [classId, setClassId] = useState<number | null>(null);
  const { mutate: getClass, isPending } = useClassDetailByName();
  useEffect(() => {
    getClass(decodedClassName, {
      onSuccess: (data: Class | null) => {
        if (data) {
          setClassId(data.id);
        }
      },
    });
  }, [decodedClassName, getClass]);

  if (isPending || !classId) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <ClassStudentsPage className={decodedClassName} classId={classId} />;
}
