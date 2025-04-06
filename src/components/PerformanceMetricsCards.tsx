
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Professional } from "@/utils/dataTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface PerformanceMetricsCardsProps {
  professionals: Professional[];
}

const PerformanceMetricsCards: React.FC<PerformanceMetricsCardsProps> = ({ professionals }) => {
  // Group professionals by role
  const roleGroups = professionals.reduce((groups, professional) => {
    if (!groups[professional.role]) {
      groups[professional.role] = [];
    }
    groups[professional.role].push(professional);
    return groups;
  }, {} as Record<string, Professional[]>);
  
  // Calculate average metrics for each role
  const roleMetricsAverages = Object.entries(roleGroups).map(([role, professionals]) => {
    // First, create a mapping of metric names to arrays of scores
    const metricScores: Record<string, number[]> = {};
    professionals.forEach(professional => {
      professional.metrics.forEach(metric => {
        if (!metricScores[metric.name]) {
          metricScores[metric.name] = [];
        }
        metricScores[metric.name].push(metric.score);
      });
    });
    
    // Then calculate the average score for each metric
    const metrics = Object.entries(metricScores).map(([name, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      // Find weight from the first professional (weights should be the same for all professionals of the same role)
      const weight = professionals[0].metrics.find(m => m.name === name)?.weight || 0;
      const description = professionals[0].metrics.find(m => m.name === name)?.description || '';
      
      return {
        name,
        weight,
        score: average,
        description
      };
    });
    
    return {
      role,
      metrics
    };
  });
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={roleMetricsAverages[0]?.role || ""}>
        <TabsList className="mb-4">
          {roleMetricsAverages.map(({ role }) => (
            <TabsTrigger key={role} value={role}>
              {role}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {roleMetricsAverages.map(({ role, metrics }) => (
          <TabsContent key={role} value={role}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{role} Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metrics.map((metric, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-healthcare-light">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{metric.name}</CardTitle>
                          <Badge variant="outline">
                            Weight: {metric.weight}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Average Score</span>
                            <span className="font-bold">{metric.score.toFixed(1)}%</span>
                          </div>
                          <Progress value={metric.score} className="h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground">{metric.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PerformanceMetricsCards;
