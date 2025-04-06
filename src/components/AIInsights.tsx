
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Professional } from "@/utils/dataTypes";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, ArrowUpRight, BarChart3, Target } from "lucide-react";

interface AIInsightsProps {
  professionals: Professional[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ professionals }) => {
  // Calculate some insights
  const averagePerformance = professionals.reduce((sum, prof) => sum + prof.performance, 0) / professionals.length;
  const highestPerformer = [...professionals].sort((a, b) => b.performance - a.performance)[0];
  const lowestMetrics = professionals.flatMap(prof => 
    prof.metrics.map(metric => ({
      professionalName: prof.name,
      professionalRole: prof.role,
      metricName: metric.name,
      score: metric.score,
      weight: metric.weight
    }))
  ).sort((a, b) => a.score - b.score).slice(0, 3);
  
  // Professional roles distribution
  const roleDistribution = professionals.reduce((acc, prof) => {
    acc[prof.role] = (acc[prof.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Role with highest average performance
  const rolePerformances = professionals.reduce((acc, prof) => {
    if (!acc[prof.role]) {
      acc[prof.role] = { total: 0, count: 0 };
    }
    acc[prof.role].total += prof.performance;
    acc[prof.role].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);
  
  const roleAverages = Object.entries(rolePerformances).map(([role, data]) => ({
    role,
    average: data.total / data.count
  }));
  
  const highestPerformingRole = roleAverages.sort((a, b) => b.average - a.average)[0];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-healthcare-primary" />
            AI Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="ai-recommendation">
              <div className="flex items-start justify-between">
                <div className="flex">
                  <BarChart3 className="h-5 w-5 mr-2 text-healthcare-primary" />
                  <div>
                    <h3 className="font-medium">Overall Performance Analysis</h3>
                    <p className="mt-1">
                      The team's average performance score is <span className="font-bold">{averagePerformance.toFixed(1)}%</span>. 
                      {averagePerformance >= 85 ? (
                        " This is excellent and indicates a high-performing healthcare team."
                      ) : averagePerformance >= 70 ? (
                        " This is good, but there's room for improvement in specific areas."
                      ) : (
                        " This indicates significant opportunities for improvement across the team."
                      )}
                    </p>
                  </div>
                </div>
                <Badge>{averagePerformance >= 85 ? "Excellent" : averagePerformance >= 70 ? "Good" : "Needs Improvement"}</Badge>
              </div>
            </div>
            
            <div className="ai-recommendation">
              <div className="flex items-start">
                <Target className="h-5 w-5 mr-2 text-healthcare-primary" />
                <div>
                  <h3 className="font-medium">Top Performer Spotlight</h3>
                  <p className="mt-1">
                    <span className="font-bold">{highestPerformer.name}</span> ({highestPerformer.role}) 
                    is your highest performing professional with a score of {highestPerformer.performance.toFixed(1)}%. 
                    Consider having them mentor others or share best practices with the team.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="ai-recommendation">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 mr-2 text-healthcare-primary" />
                <div>
                  <h3 className="font-medium">Focus Areas for Improvement</h3>
                  <p className="mt-1">
                    The following metrics show the greatest opportunity for improvement:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {lowestMetrics.map((metric, index) => (
                      <li key={index} className="flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1 text-healthcare-primary" />
                        <span>
                          <span className="font-medium">{metric.metricName}</span> for {metric.professionalName} ({metric.score}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="ai-recommendation">
              <div className="flex items-start">
                <BarChart3 className="h-5 w-5 mr-2 text-healthcare-primary" />
                <div>
                  <h3 className="font-medium">Role Performance Insights</h3>
                  <p className="mt-1">
                    <span className="font-bold">{highestPerformingRole.role}</span> is your highest performing role 
                    with an average score of {highestPerformingRole.average.toFixed(1)}%. 
                    {Object.keys(roleDistribution).length > 1 ? 
                      ` You currently have ${professionals.length} professionals across ${Object.keys(roleDistribution).length} different roles.` : 
                      ""}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="ai-recommendation">
              <div className="flex items-start">
                <Zap className="h-5 w-5 mr-2 text-healthcare-primary" />
                <div>
                  <h3 className="font-medium">AI Compensation Recommendations</h3>
                  <p className="mt-1">
                    Based on current performance metrics, your compensation allocation is 
                    {averagePerformance >= 80 ? 
                      " well-balanced and rewards top performers appropriately." : 
                      " could be optimized to better incentivize performance improvements."
                    }
                    {professionals.length >= 5 ? 
                      " Consider implementing targeted incentive programs for specific metrics that need improvement." : 
                      " As you add more professionals, look for patterns in performance to guide compensation strategy."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
