
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CompensationTableProps {
  professionals: Professional[];
  onSelectProfessional: (professional: Professional) => void;
}

const CompensationTable: React.FC<CompensationTableProps> = ({ 
  professionals,
  onSelectProfessional 
}) => {
  // Calculate total compensation budget
  const totalSalary = professionals.reduce((sum, prof) => sum + prof.salary, 0);
  const totalBonus = professionals.reduce((sum, prof) => sum + prof.bonus, 0);
  const totalCompensation = totalSalary + totalBonus;
  
  // Sort professionals by total compensation (descending)
  const sortedProfessionals = [...professionals].sort(
    (a, b) => (b.salary + b.bonus) - (a.salary + a.bonus)
  );
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Base Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSalary.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Performance Bonus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-healthcare-primary">
              ${totalBonus.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Compensation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCompensation.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {((totalBonus / totalSalary) * 100).toFixed(1)}% of base as bonus
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Compensation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name & Role</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Performance Bonus</TableHead>
                <TableHead>Total Compensation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProfessionals.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{prof.name}</div>
                      <Badge variant="outline">{prof.role}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{prof.performance.toFixed(1)}%</div>
                      <Progress value={prof.performance} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>${prof.salary.toLocaleString()}</TableCell>
                  <TableCell className="text-healthcare-primary">
                    ${prof.bonus.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${(prof.salary + prof.bonus).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => onSelectProfessional(prof)}>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompensationTable;
