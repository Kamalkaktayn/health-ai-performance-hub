
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, Printer, Share2 } from "lucide-react";
import { 
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  LineChart,
  Line
} from 'recharts';
import { Professional } from "@/utils/dataTypes";

interface ReportsSectionProps {
  professionals: Professional[];
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ professionals }) => {
  const [reportType, setReportType] = useState<'performance' | 'aiUsage' | 'compensation'>('performance');

  // Generate performance data for chart
  const generatePerformanceData = () => {
    return professionals.map(pro => ({
      name: pro.name,
      performance: pro.performance,
      aiUsage: pro.aiUsage,
      department: pro.department
    }));
  };

  // Generate AI usage data by department
  const generateAIUsageByDepartment = () => {
    const departmentMap = new Map<string, {count: number, totalUsage: number}>();
    
    professionals.forEach(pro => {
      if (!departmentMap.has(pro.department)) {
        departmentMap.set(pro.department, {count: 0, totalUsage: 0});
      }
      const dept = departmentMap.get(pro.department)!;
      dept.count += 1;
      dept.totalUsage += pro.aiUsage;
    });
    
    return Array.from(departmentMap.entries()).map(([department, data]) => ({
      department,
      averageAIUsage: data.totalUsage / data.count
    }));
  };

  // Generate compensation data
  const generateCompensationData = () => {
    const roleMap = new Map<string, {count: number, totalSalary: number, totalBonus: number}>();
    
    professionals.forEach(pro => {
      if (!roleMap.has(pro.role)) {
        roleMap.set(pro.role, {count: 0, totalSalary: 0, totalBonus: 0});
      }
      const role = roleMap.get(pro.role)!;
      role.count += 1;
      role.totalSalary += pro.salary;
      role.totalBonus += pro.bonus;
    });
    
    return Array.from(roleMap.entries()).map(([role, data]) => ({
      role,
      averageSalary: data.totalSalary / data.count,
      averageBonus: data.totalBonus / data.count,
      total: (data.totalSalary + data.totalBonus) / data.count
    }));
  };

  const handleGenerateReport = () => {
    // In a real app, this would generate a PDF or other report format
    alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderReportContent = () => {
    switch(reportType) {
      case 'performance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Performance Overview</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generatePerformanceData()}>
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
              <p>The average performance score across all professionals is {
                (professionals.reduce((sum, pro) => sum + pro.performance, 0) / professionals.length).toFixed(1)
              }%</p>
            </div>
          </div>
        );
      
      case 'aiUsage':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">AI Adoption by Department</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generateAIUsageByDepartment()}>
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
              <p>The overall average AI usage is {
                (professionals.reduce((sum, pro) => sum + pro.aiUsage, 0) / professionals.length).toFixed(1)
              }%</p>
            </div>
          </div>
        );
      
      case 'compensation':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Compensation by Role</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generateCompensationData()}>
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
              <p>The overall average total compensation is ${
                ((professionals.reduce((sum, pro) => sum + pro.salary + pro.bonus, 0)) / professionals.length).toLocaleString()
              }</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
        <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-healthcare-primary" />
                Performance Reports
              </CardTitle>
              <CardDescription>Generate and analyze performance reports</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex space-x-4 mb-6">
            <Button 
              variant={reportType === 'performance' ? "default" : "outline"} 
              onClick={() => setReportType('performance')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Performance
            </Button>
            <Button 
              variant={reportType === 'aiUsage' ? "default" : "outline"} 
              onClick={() => setReportType('aiUsage')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              AI Usage
            </Button>
            <Button 
              variant={reportType === 'compensation' ? "default" : "outline"} 
              onClick={() => setReportType('compensation')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Compensation
            </Button>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            {renderReportContent()}
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleGenerateReport}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
