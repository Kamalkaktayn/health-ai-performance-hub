
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

interface AIUsageReportProps {
  professionals: Professional[];
  data: Array<{
    department: string;
    averageAIUsage: number;
  }>;
}

const AIUsageReport: React.FC<AIUsageReportProps> = ({ professionals, data }) => {
  const averageAIUsage = (professionals.reduce((sum, pro) => sum + pro.aiUsage, 0) / professionals.length).toFixed(1);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">AI Adoption by Department</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageAIUsage" name="Average AI Usage %" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-gray-500">
        <p>This report shows the average AI usage percentage by department.</p>
        <p>The overall average AI usage is {averageAIUsage}%</p>
      </div>
    </div>
  );
};

export default AIUsageReport;
