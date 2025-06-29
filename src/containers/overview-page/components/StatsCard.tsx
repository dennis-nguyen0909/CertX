import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string; // e.g. 'bg-blue-100'
  iconColor: string; // e.g. 'text-blue-600'
  description?: string;
  descriptionColor?: string; // e.g. 'text-gray-500'
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  description,
  descriptionColor = "text-gray-500",
}) => {
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      {description && (
        <p className={`text-xs mt-2 ${descriptionColor}`}>{description}</p>
      )}
    </div>
  );
};

export default StatsCard;
