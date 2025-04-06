
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Professional, getCompensationTier } from "@/utils/dataTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp, Filter, Award } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CompensationTableProps {
  professionals: Professional[];
  onSelectProfessional: (professional: Professional) => void;
  onDeleteProfessional: (id: string) => void;
}

const CompensationTable: React.FC<CompensationTableProps> = ({ 
  professionals,
  onSelectProfessional,
  onDeleteProfessional
}) => {
  // Calculate total compensation budget
  const totalSalary = professionals.reduce((sum, prof) => sum + prof.salary, 0);
  const totalBonus = professionals.reduce((sum, prof) => sum + prof.bonus, 0);
  const totalCompensation = totalSalary + totalBonus;
  
  // State for sorting and filtering
  const [sortField, setSortField] = useState<'name' | 'performance' | 'salary' | 'bonus' | 'total'>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [tierFilter, setTierFilter] = useState<number[]>([1, 2, 3]);
  
  // Sort professionals
  const sortedProfessionals = [...professionals].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      case 'performance':
        aValue = a.performance;
        bValue = b.performance;
        break;
      case 'salary':
        aValue = a.salary;
        bValue = b.salary;
        break;
      case 'bonus':
        aValue = a.bonus;
        bValue = b.bonus;
        break;
      case 'total':
      default:
        aValue = a.salary + a.bonus;
        bValue = b.salary + b.bonus;
        break;
    }
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  }).filter(prof => {
    const tier = getCompensationTier(prof.performance).tier;
    return tierFilter.includes(tier);
  });
  
  const toggleSort = (field: 'name' | 'performance' | 'salary' | 'bonus' | 'total') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const renderSortArrow = (field: 'name' | 'performance' | 'salary' | 'bonus' | 'total') => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  
  const totalByTier = [1, 2, 3].map(tier => {
    const tierProfs = professionals.filter(p => getCompensationTier(p.performance).tier === tier);
    const tierSalary = tierProfs.reduce((sum, prof) => sum + prof.salary, 0);
    const tierBonus = tierProfs.reduce((sum, prof) => sum + prof.bonus, 0);
    return {
      tier,
      count: tierProfs.length,
      totalSalary: tierSalary,
      totalBonus: tierBonus,
      totalComp: tierSalary + tierBonus
    };
  });
  
  const getTierBadgeColor = (tier: number) => {
    switch (tier) {
      case 1: return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      case 2: return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      case 3: return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default: return "bg-gray-100";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-4 border-t-healthcare-primary shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Compensation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCompensation.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {professionals.length} professionals
            </div>
          </CardContent>
        </Card>
        
        {totalByTier.map(tier => (
          <Card key={tier.tier} className={`border-t-4 shadow-md ${
            tier.tier === 1 ? "border-t-green-500" : 
            tier.tier === 2 ? "border-t-blue-500" : 
            "border-t-amber-500"
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Tier {tier.tier} ({tier.count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${tier.totalComp.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
              <div className="text-sm text-muted-foreground mt-1">
                ${tier.totalBonus.toLocaleString(undefined, {maximumFractionDigits: 0})} in bonuses
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Compensation Details</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-4 w-4 mr-2" />
                Filter Tier
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {[1, 2, 3].map(tier => (
                <DropdownMenuCheckboxItem
                  key={tier}
                  checked={tierFilter.includes(tier)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTierFilter([...tierFilter, tier]);
                    } else {
                      setTierFilter(tierFilter.filter(t => t !== tier));
                    }
                  }}
                >
                  Tier {tier}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center">
                    Name & Role
                    {renderSortArrow('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => toggleSort('performance')}
                >
                  <div className="flex items-center">
                    Performance
                    {renderSortArrow('performance')}
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">Tier</TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => toggleSort('salary')}
                >
                  <div className="flex items-center">
                    Base Salary
                    {renderSortArrow('salary')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => toggleSort('bonus')}
                >
                  <div className="flex items-center">
                    Bonus
                    {renderSortArrow('bonus')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => toggleSort('total')}
                >
                  <div className="flex items-center">
                    Total
                    {renderSortArrow('total')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProfessionals.map((prof) => {
                const tier = getCompensationTier(prof.performance).tier;
                return (
                  <TableRow key={prof.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{prof.name}</div>
                        <Badge variant="outline">{prof.role}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="font-medium flex items-center">
                          {prof.performance.toFixed(1)}%
                          {prof.trend === 'up' ? (
                            <ChevronUp className="h-4 w-4 text-green-500 ml-1" />
                          ) : prof.trend === 'down' ? (
                            <ChevronDown className="h-4 w-4 text-red-500 ml-1" />
                          ) : null}
                        </div>
                        <Progress 
                          value={prof.performance} 
                          className="h-2" 
                          indicatorClassName={
                            prof.performance >= 90 ? "bg-gradient-to-r from-green-400 to-green-600" :
                            prof.performance >= 80 ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                            "bg-gradient-to-r from-amber-400 to-amber-600"
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={getTierBadgeColor(tier)}>
                        Tier {tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">${prof.salary.toLocaleString()}</TableCell>
                    <TableCell className="text-healthcare-primary">
                      ${prof.bonus.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(prof.salary + prof.bonus).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => onSelectProfessional(prof)}>
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onDeleteProfessional(prof.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompensationTable;
