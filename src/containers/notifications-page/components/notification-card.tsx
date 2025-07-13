import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "@/libs/dayjs";
import { Notification } from "@/models/notification";
import * as React from "react";

interface NotificationCardProps {
  notification: Notification;
  checked: boolean;
  onCheckedChange: () => void;
  index?: number;
  onClick: (notification: Notification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  checked,
  onCheckedChange,
  index,
  onClick,
}) => {
  return (
    <div
      className={`group flex items-center gap-3 px-6 py-2 border-b last:border-b-0 bg-white transition-colors ${
        !notification.read ? "bg-blue-50" : ""
      } hover:bg-accent/40`}
      onClick={() => onClick(notification)}
    >
      {/* Checkbox */}
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mr-2"
        aria-label={`Select notification ${
          index !== undefined ? index + 1 : ""
        }`}
      />
      {/* Unread dot */}
      <span
        className={`inline-block w-2 h-2 rounded-full mt-0.5 ${
          notification.read ? "bg-gray-300" : "bg-blue-500"
        }`}
      />
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold leading-tight truncate">
            {notification.title}
          </CardTitle>
          <Badge
            variant={notification.read ? "secondary" : "default"}
            className="text-xs px-2 py-0.5"
          >
            {notification.type}
          </Badge>
          <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
            {dayjs(notification.createdAt).fromNow()}
          </span>
        </div>
        <CardContent className="px-0 pb-0 pt-1 text-sm text-gray-700 truncate">
          {notification.content}
        </CardContent>
      </div>
    </div>
  );
};

export default NotificationCard;
