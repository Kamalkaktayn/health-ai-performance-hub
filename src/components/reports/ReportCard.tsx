
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer, Share2 } from "lucide-react";

interface ReportCardProps {
  reportType: 'performance' | 'aiUsage' | 'compensation';
  onSelectReportType: (type: 'performance' | 'aiUsage' | 'compensation') => void;
  onGenerateReport: () => void;
  onPrint: () => void;
  children: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  reportType, 
  onSelectReportType, 
  onGenerateReport, 
  onPrint, 
  children 
}) => {
  return (
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
        {/* Report Type Buttons */}
        <div className="flex space-x-4 mb-6">
          {children}
        </div>
        
        {/* Report Content */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          {/* This will be the report content */}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={onGenerateReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
