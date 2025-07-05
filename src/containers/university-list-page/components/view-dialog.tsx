import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUniversityDetail } from "@/hooks/university/use-university-detail";
import { Image } from "antd";
import dayjs from "dayjs";
import { BadgeCheck, XCircle, Globe2 } from "lucide-react";

interface ViewDialogProps {
  open: boolean;
  id: number | undefined;
  onClose: () => void;
}

export default function ViewDialog({ open, id, onClose }: ViewDialogProps) {
  const { data, isLoading } = useUniversityDetail(id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-2xl p-0 border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100">
        <DialogHeader className="px-8 pt-8 pb-2">
          <DialogTitle className="text-center text-2xl font-bold">
            Thông tin trường đại học
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : data ? (
          <div className="flex flex-col gap-6 px-8 pb-8">
            <div className="flex flex-col items-center gap-2 mb-2">
              <Image
                src={data.logo}
                width={80}
                height={80}
                alt={data.name}
                className="rounded-lg bg-white border shadow h-20 w-20 object-contain"
                preview={false}
              />
              <div className="text-xl font-bold mt-2">{data.name}</div>
              {data.id && (
                <div className="text-gray-500 text-sm">ID: {data.id}</div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <span className="font-semibold text-gray-700">Email:</span>{" "}
                {data.email}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Mã số thuế:</span>{" "}
                {data.taxCode}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Địa chỉ:</span>{" "}
                {data.address}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Website:</span>
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline flex items-center gap-1"
                >
                  <Globe2 className="w-4 h-4" />
                  {data.website}
                </a>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Ngày tạo:</span>{" "}
                {data.createdAt
                  ? dayjs(data.createdAt).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Ngày cập nhật:
                </span>{" "}
                {data.updatedAt
                  ? dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Trạng thái khóa:
                </span>{" "}
                {data.locked ? (
                  <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">
                    Đã khóa
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
                    Hoạt động
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  Đã xác thực:
                </span>
                {data.verifile ? (
                  <BadgeCheck className="text-green-600 w-5 h-5" />
                ) : (
                  <XCircle className="text-red-400 w-5 h-5" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">
            Không tìm thấy dữ liệu
          </div>
        )}
        <div className="flex justify-end mt-4 px-8 pb-4">
          <Button variant="outline" onClick={onClose} className="min-w-[100px]">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
