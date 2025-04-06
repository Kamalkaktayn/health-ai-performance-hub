
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Legend, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Users, Award } from "lucide-react";
import { Professional } from "@/utils/dataTypes";

interface DashboardOverviewProps {
  professionals: Professional[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ professionals }) => {
  // Calculate average performance by role
  const rolePerformance = professionals.reduce((acc, prof) => {
    if (!acc[prof.role]) {
      acc[prof.role] = { totalPerformance: 0, count: 0 };
    }
    acc[prof.role].totalPerformance += prof.performance;
    acc[prof.role].count += 1;
    return acc;
  }, {} as Record<string, { totalPerformance: number, count: number }>);
  
  const performanceByRole = Object.entries(rolePerformance).map(([role, data]) => ({
    name: role,
    value: data.totalPerformance / data.count
  }));
  
  // Get top performers
  const topPerformers = [...professionals]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 3);
  
  // Total bonus allocation
  const totalBonus = professionals.reduce((sum, prof) => sum + prof.bonus, 0);
  
  // Get performance trends
  const trendCounts = professionals.reduce((acc, prof) => {
    acc[prof.trend] = (acc[prof.trend] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const trendData = [
    { name: 'Improving', value: trendCounts.up || 0 },
    { name: 'Stable', value: trendCounts.stable || 0 },
    { name: 'Declining', value: trendCounts.down || 0 }
  ];
  
  // Colors for pie chart
  const COLORS = ['#0EA5E9', '#7DD3FC', '#38BDF8', '#0284C7', '#4ADE80'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Activity className="mr-2 h-5 w-5 text-healthcare-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceByRole}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Performance']}
                  labelStyle={{ color: '#0F172A' }}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', borderColor: '#E2E8F0' }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="#0EA5E9" 
                  name="Average Performance" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-healthcare-primary" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Professionals']}
                  labelStyle={{ color: '#0F172A' }}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', borderColor: '#E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Award className="mr-2 h-5 w-5 text-healthcare-primary" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((prof, index) => (
              <div key={prof.id} className="flex items-center gap-4">
                <div className="font-bold text-lg text-healthcare-primary">{index + 1}</div>
                <div className="flex-1">
                  <div className="font-medium">{prof.name}</div>
                  <div className="text-sm text-muted-foreground">{prof.role}</div>
                </div>
                <div className="text-lg font-bold">{prof.performance.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Users className="mr-2 h-5 w-5 text-healthcare-primary" />
            Staff Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceByRole}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name }) => name}
                >
                  {performanceByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Performance']}
                  labelStyle={{ color: '#0F172A' }}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', borderColor: '#E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
