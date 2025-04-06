
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  PieChart, 
  DollarSign, 
  ArrowUpRight,
  PenLine,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIRecommendation, Professional, getRecommendations } from "@/utils/dataTypes";

interface ProfessionalDetailsProps {
  professional: Professional;
}

const ProfessionalDetails: React.FC<ProfessionalDetailsProps> = ({ professional }) => {
  const recommendations: AIRecommendation[] = getRecommendations(professional.metrics, professional.role);
  
  const renderTrendIcon = () => {
    switch (professional.trend) {
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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">{professional.name}</CardTitle>
              <CardDescription>{professional.role} - {professional.department}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <PenLine className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 bg-healthcare-light p-6 rounded-lg flex flex-col items-center justify-center">
              <div className="relative mb-2">
                <PieChart className="h-16 w-16 text-healthcare-primary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{professional.performance.toFixed(1)}%</span>
                </div>
              </div>
              <h3 className="text-lg font-medium">Overall Performance</h3>
              <div className="flex items-center mt-2 text-sm">
                {renderTrendIcon()}
                <span className="ml-1">
                  {professional.trend === 'up' ? 'Improving' : 
                   professional.trend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {professional.metrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{metric.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-bold">{metric.score}%</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          Weight: {metric.weight}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <div className="flex items-center mb-4">
              <UserCog className="h-5 w-5 mr-2 text-healthcare-primary" />
              <h3 className="text-lg font-medium">AI Performance Insights</h3>
            </div>
            
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="ai-recommendation">
                  <div className="flex justify-between">
                    <span className="font-medium">{rec.metric}</span>
                    <Badge variant={rec.impact === 'high' ? "destructive" : rec.impact === 'medium' ? "default" : "secondary"}>
                      {rec.impact} impact
                    </Badge>
                  </div>
                  <p className="mt-2">{rec.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 mr-2 text-healthcare-primary" />
              <h3 className="text-lg font-medium">Compensation</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-white">
                <div className="text-sm text-muted-foreground">Base Salary</div>
                <div className="text-xl font-bold">${professional.salary.toLocaleString()}</div>
              </div>
              
              <div className="p-4 border rounded-lg bg-white">
                <div className="text-sm text-muted-foreground">Performance Bonus</div>
                <div className="text-xl font-bold text-healthcare-primary">
                  ${professional.bonus.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-healthcare-light">
                <div className="text-sm text-muted-foreground">Total Compensation</div>
                <div className="text-xl font-bold">
                  ${(professional.salary + professional.bonus).toLocaleString(undefined, {maximumFractionDigits: 0})}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Performance bonus is calculated based on overall performance metrics and is 
                capped at 15% of base salary. Current performance rate: {professional.performance.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDetails;
