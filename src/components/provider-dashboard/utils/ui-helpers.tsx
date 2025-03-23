import React from 'react';
import { Badge } from "@/components/ui/badge";

/**
 * Status badge component for displaying patient status
 */
export const StatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case "stable":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Stable</Badge>;
    case "improving":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Improving</Badge>;
    case "monitoring":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Monitoring</Badge>;
    case "deteriorating":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Needs Attention</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

/**
 * Adherence badge component for displaying medication adherence
 */
export const AdherenceBadge = ({ adherence }: { adherence: string }) => {
  switch(adherence) {
    case "excellent":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>;
    case "good":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Good</Badge>;
    case "moderate":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate</Badge>;
    case "poor":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Poor</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{adherence}</Badge>;
  }
};

/**
 * Alert severity indicator
 */
export const SeverityIndicator = ({ severity }: { severity: string }) => {
  switch(severity) {
    case "low":
      return <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"></span>;
    case "moderate":
      return <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></span>;
    case "high":
      return <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 mr-2"></span>;
    case "critical":
      return <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse mr-2"></span>;
    default:
      return <span className="flex h-2.5 w-2.5 rounded-full bg-gray-500 mr-2"></span>;
  }
};

/**
 * Format message time 
 */
export const formatMessageTime = (time: string) => {
  if (time.includes('minutes') || time.includes('hours') || time === 'Yesterday') {
    return time;
  }
  // For older messages, return just the date part
  return time.split(' ')[0];
}; 