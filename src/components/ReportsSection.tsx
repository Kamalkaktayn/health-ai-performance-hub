
import React, { useState } from 'react';
import { BarChart3 } from "lucide-react";
import { Professional } from "@/utils/dataTypes";
import { 
  generatePerformanceData, 
  generateAIUsageByDepartment, 
  generateCompensationData 
} from "@/utils/reportUtils";
import ReportCard from "./reports/ReportCard";
import ReportTypeButton from "./reports/ReportTypeButton";
import PerformanceReport from "./reports/PerformanceReport";
import AIUsageReport from "./reports/AIUsageReport";
import CompensationReport from "./reports/CompensationReport";

interface ReportsSectionProps {
  professionals: Professional[];
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ professionals }) => {
  const [reportType, setReportType] = useState<'performance' | 'aiUsage' | 'compensation'>('performance');

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
          <PerformanceReport 
            professionals={professionals} 
            data={generatePerformanceData(professionals)} 
          />
        );
      
      case 'aiUsage':
        return (
          <AIUsageReport 
            professionals={professionals} 
            data={generateAIUsageByDepartment(professionals)} 
          />
        );
      
      case 'compensation':
        return (
          <CompensationReport 
            professionals={professionals} 
            data={generateCompensationData(professionals)} 
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <ReportCard
        reportType={reportType}
        onSelectReportType={setReportType}
        onGenerateReport={handleGenerateReport}
        onPrint={handlePrint}
      >
        <ReportTypeButton 
          type="performance" 
          currentType={reportType} 
          label="Performance" 
          onClick={setReportType} 
        />
        <ReportTypeButton 
          type="aiUsage" 
          currentType={reportType} 
          label="AI Usage" 
          onClick={setReportType} 
        />
        <ReportTypeButton 
          type="compensation" 
          currentType={reportType} 
          label="Compensation" 
          onClick={setReportType} 
        />
      </ReportCard>
    </div>
  );
};

export default ReportsSection;
