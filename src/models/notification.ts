export interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  refId?: number; // Added this line
  createdAt: string; // ISO date string
  read: boolean;
}

// Example notification object:
// {
//   id: 142,
//   title: "Tạo văn bằng",
//   content: "Khoa Kinh tế đối ngoại đã tạo văn bằng có số hiệu: 234827om",
//   type: "DEGREE_CREATED",
//   createdAt: "2025-07-10T23:47:09",
//   read: false
// }

export type NotificationStatus = "all" | "read" | "unread" | null;
