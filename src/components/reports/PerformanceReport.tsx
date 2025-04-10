
import React from 'react';
import {
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis
} from 'recharts';
import { Professional } from "@/utils/dataTypes";

interface PerformanceReportProps {
  professionals: Professional[];
  data: Array<{
    name: string;
    performance: number;
    aiUsage: number;
    department: string;
  }>;
}

const PerformanceReport: React.FC<PerformanceReportProps> = ({ professionals, data }) => {
  const averagePerformance = (professionals.reduce((sum, pro) => sum + pro.performance, 0) / professionals.length).toFixed(1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Performance Overview</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="performance" name="Performance Score" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-gray-500">
        <p>This report shows the performance scores of all professionals in the system.</p>
        <p>The average performance score across all professionals is {averagePerformance}%</p>
      </div>
    </div>
  );
};

export default PerformanceReport;
