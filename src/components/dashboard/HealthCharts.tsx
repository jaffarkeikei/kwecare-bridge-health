
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Activity, BarChart2, Heart, LineChart as LineChartIcon } from "lucide-react";

// Sample data for glucose levels over time
const glucoseData = [
  { name: "Mon", glucose: 120 },
  { name: "Tue", glucose: 132 },
  { name: "Wed", glucose: 101 },
  { name: "Thu", glucose: 134 },
  { name: "Fri", glucose: 90 },
  { name: "Sat", glucose: 110 },
  { name: "Sun", glucose: 120 },
];

// Sample data for blood pressure
const bpData = [
  { name: "Mon", systolic: 120, diastolic: 80 },
  { name: "Tue", systolic: 122, diastolic: 78 },
  { name: "Wed", systolic: 130, diastolic: 85 },
  { name: "Thu", systolic: 125, diastolic: 82 },
  { name: "Fri", systolic: 118, diastolic: 75 },
  { name: "Sat", systolic: 115, diastolic: 76 },
  { name: "Sun", systolic: 120, diastolic: 80 },
];

// Sample activity data
const activityData = [
  { name: "Mon", steps: 6500 },
  { name: "Tue", steps: 7200 },
  { name: "Wed", steps: 8100 },
  { name: "Thu", steps: 5400 },
  { name: "Fri", steps: 9200 },
  { name: "Sat", steps: 10500 },
  { name: "Sun", steps: 8200 },
];

const chartConfig = {
  glucose: {
    label: "Blood Glucose",
    theme: { light: "#3b82f6", dark: "#60a5fa" },
  },
  systolic: {
    label: "Systolic",
    theme: { light: "#ef4444", dark: "#f87171" },
  },
  diastolic: {
    label: "Diastolic",
    theme: { light: "#f97316", dark: "#fb923c" },
  },
  steps: {
    label: "Steps",
    theme: { light: "#10b981", dark: "#34d399" },
  },
};

const HealthCharts = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-kwecare-primary" />
          Health Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="glucose" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="glucose" className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Glucose</span>
            </TabsTrigger>
            <TabsTrigger value="bp" className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Blood Pressure</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <LineChartIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="glucose" className="mt-0">
            <ChartContainer config={chartConfig} className="h-64">
              <AreaChart data={glucoseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-glucose)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-glucose)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[80, 150]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="glucose" stroke="var(--color-glucose)" fillOpacity={1} fill="url(#colorGlucose)" />
              </AreaChart>
            </ChartContainer>
            <div className="text-xs text-muted-foreground text-center mt-2">Weekly Blood Glucose (mg/dL)</div>
          </TabsContent>
          
          <TabsContent value="bp" className="mt-0">
            <ChartContainer config={chartConfig} className="h-64">
              <LineChart data={bpData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[70, 140]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="var(--color-systolic)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="diastolic" stroke="var(--color-diastolic)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
            <div className="text-xs text-muted-foreground text-center mt-2">Weekly Blood Pressure (mmHg)</div>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-0">
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="steps" fill="var(--color-steps)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="text-xs text-muted-foreground text-center mt-2">Daily Step Count</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HealthCharts;
