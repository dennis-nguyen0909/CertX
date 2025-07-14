export interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  refId?: number; // Added this line
  createdAt: string; // ISO date string
  read: boolean;
  documentType?: string;
  documentId?: number;
}

// Example notification objects:
// {
//   id: 142,
//   title: "Tạo văn bằng",
//   content: "Khoa Kinh tế đối ngoại đã tạo văn bằng có số hiệu: 234827om",
//   type: "DEGREE_CREATED",
//   createdAt: "2025-07-10T23:47:09",
//   read: false
// },
// {
//   id: 178,
//   title: "Từ chối chứng chỉ",
//   content: "Phòng đào tạo đã từ chối xác nhận văn bằng có số hiệu: 123123132",
//   type: "CERTIFICATE_REJECTED",
//   documentType: "DEGREE",
//   documentId: 266,
//   createdAt: "2025-07-14T01:02:27",
//   read: false
// }

export type NotificationStatus = "all" | "read" | "unread" | null;
