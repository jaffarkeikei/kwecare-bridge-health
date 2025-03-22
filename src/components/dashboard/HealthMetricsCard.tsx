
import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface HealthMetric {
  title: string;
  value: string;
  unit: string;
  change: string;
  status: string;
  icon: React.ReactNode;
}

interface HealthMetricsCardProps {
  metric: HealthMetric;
}

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ metric }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "alert":
        return "text-red-500";
      case "upcoming":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const statusColor = getStatusColor(metric.status);

  return (
    <div className="glass-card p-4 card-hover-effect">
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium text-sm text-foreground/80">
          {metric.title}
        </div>
        <div className="p-1.5 rounded-full bg-background/70">
          {metric.icon}
        </div>
      </div>
      
      <div className="flex items-end">
        <div className="text-2xl font-semibold">{metric.value}</div>
        {metric.unit && <div className="ml-1 mb-0.5 text-sm text-muted-foreground">{metric.unit}</div>}
      </div>
      
      {metric.change && (
        <div className="flex items-center mt-2">
          {parseFloat(metric.change) > 0 ? (
            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 text-blue-500 mr-1" />
          )}
          <span className="text-xs">
            {metric.change} from last reading
          </span>
        </div>
      )}
      
      <div className={`mt-2 text-xs ${statusColor}`}>
        {metric.status === "normal" && "Within normal range"}
        {metric.status === "warning" && "Slightly elevated"}
        {metric.status === "alert" && "Requires attention"}
        {metric.status === "upcoming" && "Scheduled"}
      </div>
    </div>
  );
};

export default HealthMetricsCard;
