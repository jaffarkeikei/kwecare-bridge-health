
import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface MetricProps {
  title: string;
  value: string;
  unit: string;
  change: string;
  status: string;
  icon: React.ReactNode;
}

interface HealthMetricsCardProps {
  metric: MetricProps;
}

const statusVariants = cva("text-xs font-medium", {
  variants: {
    status: {
      normal: "text-green-500",
      warning: "text-amber-500",
      alert: "text-red-500",
      upcoming: "text-blue-500",
    },
  },
  defaultVariants: {
    status: "normal",
  },
});

const cardVariants = cva(
  "glass-card p-4 rounded-xl flex flex-col transition-all duration-300 hover:shadow-md animate-fade-in", 
  {
    variants: {
      status: {
        normal: "hover:border-green-200 hover:bg-green-50/30",
        warning: "hover:border-amber-200 hover:bg-amber-50/30",
        alert: "hover:border-red-200 hover:bg-red-50/30",
        upcoming: "hover:border-blue-200 hover:bg-blue-50/30",
      },
    },
    defaultVariants: {
      status: "normal",
    },
  }
);

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ metric }) => {
  return (
    <div className={cn(cardVariants({ status: metric.status as any }))}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{metric.title}</span>
        <div className="p-2 bg-white rounded-full shadow-sm">
          {metric.icon}
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-1">
        <div className="flex items-baseline">
          <span className="text-xl font-bold">{metric.value}</span>
          {metric.unit && (
            <span className="text-xs ml-1 text-muted-foreground">{metric.unit}</span>
          )}
        </div>
        
        {metric.change && (
          <div className="flex items-center">
            <span 
              className={`text-xs ${metric.change.startsWith('+') ? 'text-green-500' : 
                metric.change.startsWith('-') ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              {metric.change}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <span className={cn(statusVariants({ status: metric.status as any }))}>
          {metric.status === "normal" && "Normal Range"}
          {metric.status === "warning" && "Requires Attention"}
          {metric.status === "alert" && "Out of Range"}
          {metric.status === "upcoming" && "Scheduled"}
        </span>
      </div>
    </div>
  );
};

export default HealthMetricsCard;
