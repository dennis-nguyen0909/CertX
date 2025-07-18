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
      className={`group flex items-center gap-3 px-6 py-4 border-b last:border-b-0 transition-colors cursor-pointer
      ${
        !notification.read
          ? "bg-white hover:bg-gray-50"
          : "bg-muted/50 hover:bg-muted"
      }
      `}
      onClick={() => onClick(notification)}
    >
      {/* Star icon */}
      <Star
        className={`w-4 h-4 mr-2 ${
          !notification.read ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
      {/* Avatar */}
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
          {notification.title
            ? notification.title.charAt(0).toUpperCase()
            : "N"}
        </AvatarFallback>
      </Avatar>

      {/* Unread dot - hidden as per new design */}
      {/* <span
        className={`inline-block w-2 h-2 rounded-full mt-0.5 ${
          notification.read ? "bg-gray-300" : "bg-blue-500"
        }`}
      /> */}
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
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
            className={`text-xs whitespace-nowrap ${
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
          className={`px-0 pb-0 pt-1 text-sm ${
            !notification.read ? "text-gray-700" : "text-gray-500"
          } truncate`}
        >
          {notification.content}
        </CardContent>
      </div>
    </div>
  );
};

export default NotificationCard;
