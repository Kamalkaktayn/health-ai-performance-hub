
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
  UserCog,
  Award,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AIRecommendation, 
  Professional, 
  getRecommendations, 
  getCompensationTier 
} from "@/utils/dataTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfessionalDetailsProps {
  professional: Professional;
}

const ProfessionalDetails: React.FC<ProfessionalDetailsProps> = ({ professional }) => {
  const recommendations: AIRecommendation[] = getRecommendations(professional.metrics, professional.role);
  const compensationTier = getCompensationTier(professional.performance);
  
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
  
  const getTierColor = (tier: 1 | 2 | 3) => {
    switch (tier) {
      case 1: return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      case 2: return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      case 3: return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default: return "bg-gray-100";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
        <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
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
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gradient-to-br from-healthcare-light to-white p-6 rounded-lg flex flex-col items-center justify-center shadow-md">
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
                
                <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center mb-4 gap-2">
                    <Trophy className="h-5 w-5 text-healthcare-primary" />
                    <h3 className="text-lg font-medium">Performance Tier</h3>
                  </div>
                  <div className={`p-4 rounded-lg ${getTierColor(compensationTier.tier)} mb-4`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Award className="h-6 w-6" />
                        <span className="font-bold text-lg">{compensationTier.name}</span>
                      </div>
                      <Badge variant="outline" className="bg-white text-gray-800">Tier {compensationTier.tier}</Badge>
                    </div>
                    <p className="mt-2 text-sm">{compensationTier.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Performance Summary</h4>
                    <ul className="space-y-2">
                      {professional.metrics.sort((a, b) => b.score - a.score).slice(0, 2).map((metric, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                          <span>Strongest in <span className="font-medium">{metric.name}</span> ({metric.score}%)</span>
                        </li>
                      ))}
                      {professional.metrics.sort((a, b) => a.score - b.score).slice(0, 1).map((metric, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4 text-red-500 rotate-180" />
                          <span>Needs improvement in <span className="font-medium">{metric.name}</span> ({metric.score}%)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
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
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {professional.metrics.map((metric, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="font-medium">{metric.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold">{metric.score}%</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          Weight: {metric.weight}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={metric.score} 
                      className="h-2.5 mb-2"
                      indicatorClassName={
                        metric.score >= 90 ? "bg-gradient-to-r from-green-400 to-green-600" :
                        metric.score >= 80 ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                        metric.score >= 70 ? "bg-gradient-to-r from-amber-400 to-amber-600" :
                        "bg-gradient-to-r from-red-400 to-red-600"
                      }
                    />
                    <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="compensation" className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
                  <DollarSign className="h-5 w-5 mr-2 text-healthcare-primary" />
                  <h3 className="text-lg font-medium">Compensation Package</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 border rounded-lg bg-gradient-to-br from-white to-healthcare-light shadow-md">
                    <div className="text-sm text-muted-foreground">Base Salary</div>
                    <div className="text-xl font-bold">${professional.salary.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-5 border rounded-lg bg-gradient-to-br from-white to-healthcare-light shadow-md">
                    <div className="text-sm text-muted-foreground">Performance Bonus</div>
                    <div className="text-xl font-bold text-healthcare-primary">
                      ${professional.bonus.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(compensationTier.bonusPercentage * 100).toFixed(0)}% of base salary
                    </div>
                  </div>
                  
                  <div className={`p-5 rounded-lg shadow-md ${getTierColor(compensationTier.tier)}`}>
                    <div className="text-sm opacity-90">Total Compensation</div>
                    <div className="text-xl font-bold">
                      ${(professional.salary + professional.bonus).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs opacity-90">Tier {compensationTier.tier} ({compensationTier.name})</div>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Benefits Package</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {compensationTier.tier === 1 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">Premium Benefits (Tier 1)</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Comprehensive healthcare with premium coverage</li>
                            <li>Additional 5 days of paid time off</li>
                            <li>Executive mentorship program</li>
                            <li>Leadership development opportunities</li>
                            <li>Priority for promotion consideration</li>
                          </ul>
                        </div>
                      )}
                      
                      {compensationTier.tier === 2 && (
                        <div>
                          <h4 className="font-medium text-blue-600 mb-2">Standard Benefits (Tier 2)</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Comprehensive healthcare package</li>
                            <li>Standard paid time off allowance</li>
                            <li>Professional development fund</li>
                            <li>Regular performance reviews</li>
                            <li>Career advancement opportunities</li>
                          </ul>
                        </div>
                      )}
                      
                      {compensationTier.tier === 3 && (
                        <div>
                          <h4 className="font-medium text-amber-600 mb-2">Development Benefits (Tier 3)</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Standard healthcare coverage</li>
                            <li>Basic paid time off</li>
                            <li>Specialized training programs</li>
                            <li>Regular coaching sessions</li>
                            <li>Performance improvement plan</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDetails;
