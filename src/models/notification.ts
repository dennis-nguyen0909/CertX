export interface Notification {
  title: string;
  content: string;
  type: NotificationStatus; // e.g., 'DEGREE_CREATED'
  createdAt: string; // ISO date string
  read: boolean;
}

export type NotificationStatus = "all" | "read" | "unread";
