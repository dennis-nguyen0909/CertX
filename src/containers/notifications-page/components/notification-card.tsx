import { CardTitle, CardContent } from "@/components/ui/card";
import dayjs from "@/libs/dayjs";
import { Notification } from "@/models/notification";
import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
  return (
    <div
      className={`group flex items-start gap-3 px-6 py-4 border-b last:border-b-0 transition-colors cursor-pointer
        ${
          !notification.read
            ? "bg-white hover:bg-gray-50"
            : "bg-muted/50 hover:bg-muted"
        }
        sm:px-6 sm:py-4 px-3 py-3
      `}
      onClick={() => onClick(notification)}
    >
      {/* Star icon */}
      <Star
        className={`w-4 h-4 mr-2 flex-shrink-0 mt-1.5 ${
          !notification.read ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1.5">
        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
          {notification.title
            ? notification.title.charAt(0).toUpperCase()
            : "N"}
        </AvatarFallback>
      </Avatar>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <CardTitle
            className={`text-sm leading-tight flex-1 truncate ${
              !notification.read
                ? "font-bold text-gray-900"
                : "font-medium text-gray-700"
            }`}
          >
            {notification.title}
          </CardTitle>
          <span
            className={`text-xs whitespace-nowrap mt-0.5 sm:mt-0 ${
              !notification.read
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {dayjs(notification.createdAt)
              .fromNow()
              .replace("trước", "")
              .trim()}
          </span>
        </div>
        <CardContent
          className={`px-0 pb-0 pt-1 text-sm break-words ${
            !notification.read ? "text-gray-700" : "text-gray-500"
          } 
          whitespace-pre-line
          `}
        >
          {notification.content}
        </CardContent>
      </div>
    </div>
  );
};

export default NotificationCard;
