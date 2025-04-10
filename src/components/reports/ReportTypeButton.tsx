
import React from 'react';
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

interface ReportTypeButtonProps {
  type: 'performance' | 'aiUsage' | 'compensation';
  currentType: 'performance' | 'aiUsage' | 'compensation';
  label: string;
  onClick: (type: 'performance' | 'aiUsage' | 'compensation') => void;
}

const ReportTypeButton: React.FC<ReportTypeButtonProps> = ({ 
  type, 
  currentType, 
  label, 
  onClick 
}) => {
  return (
    <Button 
      variant={currentType === type ? "default" : "outline"} 
      onClick={() => onClick(type)}
    >
      <BarChart3 className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};

export default ReportTypeButton;
