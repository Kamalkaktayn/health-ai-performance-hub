
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Professional } from "@/utils/dataTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from "lucide-react";

interface ProfessionalsListProps {
  professionals: Professional[];
  onSelectProfessional: (professional: Professional) => void;
}

const ProfessionalsList: React.FC<ProfessionalsListProps> = ({ 
  professionals,
  onSelectProfessional
}) => {
  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'General Doctor':
        return 'default';
      case 'Psychiatrist':
        return 'secondary';
      case 'Quality Assurance':
        return 'outline';
      case 'Healthcare IT':
        return 'destructive';
      case 'Lab Technician':
        return 'default';
      default:
        return 'outline';
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name & Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="text-right">Compensation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{professional.name}</div>
                  <Badge variant={getRoleBadgeVariant(professional.role)}>
                    {professional.role}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{professional.department}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{professional.performance.toFixed(1)}%</span>
                    <span>{renderTrendIcon(professional.trend)}</span>
                  </div>
                  <Progress value={professional.performance} className="h-2" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="font-medium">${professional.salary.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">
                  +${professional.bonus.toLocaleString(undefined, {maximumFractionDigits: 0})} bonus
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => onSelectProfessional(professional)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfessionalsList;
