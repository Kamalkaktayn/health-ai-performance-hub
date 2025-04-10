
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

interface CompensationReportProps {
  professionals: Professional[];
  data: Array<{
    role: string;
    averageSalary: number;
    averageBonus: number;
    total: number;
  }>;
}

const CompensationReport: React.FC<CompensationReportProps> = ({ professionals, data }) => {
  const averageTotalCompensation = ((professionals.reduce((sum, pro) => sum + pro.salary + pro.bonus, 0)) / professionals.length).toLocaleString();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Compensation by Role</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageSalary" name="Average Salary" fill="#8884d8" />
            <Bar dataKey="averageBonus" name="Average Bonus" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-gray-500">
        <p>This report shows the average compensation by professional role.</p>
        <p>The overall average total compensation is ${averageTotalCompensation}</p>
      </div>
    </div>
  );
};

export default CompensationReport;
