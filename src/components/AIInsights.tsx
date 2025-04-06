
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Professional, getCompensationTier } from "@/utils/dataTypes";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, ArrowUpRight, BarChart3, Target, TrendingUp, Award, DollarSign, Landmark } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIInsightsProps {
  professionals: Professional[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ professionals }) => {
  // Check if there are any professionals to analyze
  if (!professionals || professionals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-healthcare-primary" />
            AI Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No professionals data available. Add professionals to see AI insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate some insights
  const averagePerformance = professionals.reduce((sum, prof) => sum + prof.performance, 0) / professionals.length;
  
  // Safely get highest performer
  const highestPerformer = professionals.length > 0 
    ? [...professionals].sort((a, b) => b.performance - a.performance)[0]
    : null;
  
  // Get lowest metrics if professionals exist
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
  
  // Safely get highest performing role
  const highestPerformingRole = roleAverages.length > 0
    ? roleAverages.sort((a, b) => b.average - a.average)[0]
    : null;
  
  // Get tier distribution
  const tierDistribution = professionals.reduce((acc, prof) => {
    const tier = getCompensationTier(prof.performance).tier;
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Calculate total compensation by tier
  const compensationByTier = professionals.reduce((acc, prof) => {
    const tier = getCompensationTier(prof.performance).tier;
    if (!acc[tier]) {
      acc[tier] = { salary: 0, bonus: 0 };
    }
    acc[tier].salary += prof.salary;
    acc[tier].bonus += prof.bonus;
    return acc;
  }, {} as Record<number, { salary: number, bonus: number }>);
  
  // Calculate performance trend
  const trendCounts = professionals.reduce((acc, prof) => {
    acc[prof.trend] = (acc[prof.trend] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const getProgressColor = (value: number) => {
    if (value >= 90) return "bg-gradient-to-r from-green-400 to-green-600";
    if (value >= 80) return "bg-gradient-to-r from-blue-400 to-blue-600";
    if (value >= 70) return "bg-gradient-to-r from-amber-400 to-amber-600";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };
  
  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1: return "Premium";
      case 2: return "Core";
      case 3: return "Development";
      default: return "Unknown";
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="compensation">Compensation Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="border-t-4 border-t-healthcare-primary shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-healthcare-primary" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-healthcare-light to-white p-5 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Average Performance</h3>
                      <Badge className={getProgressColor(averagePerformance)}>
                        {averagePerformance >= 90 ? "Excellent" : 
                         averagePerformance >= 80 ? "Good" : 
                         averagePerformance >= 70 ? "Average" : "Needs Improvement"}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold mb-2 text-healthcare-primary">{averagePerformance.toFixed(1)}%</div>
                    <Progress value={averagePerformance} className="h-2.5" indicatorClassName={getProgressColor(averagePerformance)} />
                  </div>
                  
                  <div className="bg-gradient-to-br from-healthcare-light to-white p-5 rounded-xl shadow-md">
                    <div className="mb-3">
                      <h3 className="font-medium">Performance Trends</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600 mb-1" />
                        <div className="text-xl font-bold">{trendCounts.up || 0}</div>
                        <div className="text-xs text-muted-foreground">Improving</div>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-blue-100 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600 mb-1" />
                        <div className="text-xl font-bold">{trendCounts.stable || 0}</div>
                        <div className="text-xs text-muted-foreground">Stable</div>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-red-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-red-600 mb-1 rotate-180" />
                        <div className="text-xl font-bold">{trendCounts.down || 0}</div>
                        <div className="text-xs text-muted-foreground">Declining</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-healthcare-light to-white p-5 rounded-xl shadow-md">
                    <div className="mb-3">
                      <h3 className="font-medium">Top Performer</h3>
                    </div>
                    {highestPerformer ? (
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="h-8 w-8 text-healthcare-primary" />
                          <div>
                            <div className="font-bold text-lg">{highestPerformer.name}</div>
                            <div className="text-xs text-muted-foreground">{highestPerformer.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-sm mr-2">Performance:</span>
                          <span className="font-bold">{highestPerformer.performance.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-sm mr-2">Tier:</span>
                          <Badge className={getProgressColor(highestPerformer.performance)}>
                            Tier {getCompensationTier(highestPerformer.performance).tier}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No data available</p>
                    )}
                  </div>
                </div>
                
                {highestPerformingRole && (
                  <div className="ai-recommendation">
                    <div className="flex items-start justify-between">
                      <div className="flex">
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
                      <Badge>{highestPerformingRole.average.toFixed(0)}%</Badge>
                    </div>
                  </div>
                )}
                
                {lowestMetrics.length > 0 && (
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
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compensation">
          <Card className="border-t-4 border-t-healthcare-primary shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-healthcare-primary" />
                Compensation Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(tier => {
                    const count = tierDistribution[tier] || 0;
                    const percent = professionals.length > 0 ? (count / professionals.length) * 100 : 0;
                    const compensation = compensationByTier[tier] || { salary: 0, bonus: 0 };
                    const totalComp = compensation.salary + compensation.bonus;
                    
                    return (
                      <div 
                        key={tier} 
                        className={`p-5 rounded-xl shadow-md ${
                          tier === 1 ? "bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-l-green-500" : 
                          tier === 2 ? "bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-500" : 
                          "bg-gradient-to-br from-amber-50 to-amber-100 border-l-4 border-l-amber-500"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <Award className={`h-5 w-5 mr-2 ${
                              tier === 1 ? "text-green-600" : 
                              tier === 2 ? "text-blue-600" : 
                              "text-amber-600"
                            }`} />
                            <h3 className="font-medium">Tier {tier}: {getTierLabel(tier)}</h3>
                          </div>
                          <Badge className={
                            tier === 1 ? "bg-green-600" : 
                            tier === 2 ? "bg-blue-600" : 
                            "bg-amber-600"
                          }>
                            {count} staff
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm text-muted-foreground">Staff Percentage</div>
                          <div className="text-xl font-bold">{percent.toFixed(1)}%</div>
                          <Progress 
                            value={percent} 
                            className="h-1.5 mt-1" 
                            indicatorClassName={
                              tier === 1 ? "bg-green-600" : 
                              tier === 2 ? "bg-blue-600" : 
                              "bg-amber-600"
                            } 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="p-2 bg-white/70 rounded-lg">
                            <div className="text-xs text-muted-foreground">Total Comp</div>
                            <div className="text-sm font-bold">${totalComp.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                          </div>
                          <div className="p-2 bg-white/70 rounded-lg">
                            <div className="text-xs text-muted-foreground">Bonus</div>
                            <div className="text-sm font-bold">${compensation.bonus.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="ai-recommendation">
                  <div className="flex items-start">
                    <Landmark className="h-5 w-5 mr-2 text-healthcare-primary" />
                    <div>
                      <h3 className="font-medium">Budget Allocation Analysis</h3>
                      <p className="mt-1">
                        Your total compensation budget is <span className="font-bold">${(totalCompensationByTier(compensationByTier)).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>, 
                        with <span className="font-bold">${(totalBonusByTier(compensationByTier)).toLocaleString(undefined, {maximumFractionDigits: 0})}</span> allocated to performance bonuses.
                        {getTierDistributionRecommendation(tierDistribution, professionals.length)}
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
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card className="border-t-4 border-t-healthcare-primary shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-healthcare-primary" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-l-4 border-l-green-600">
                  <h3 className="font-medium text-green-800 mb-2">Performance Optimization</h3>
                  <p className="text-green-800">
                    {getPerformanceRecommendation(averagePerformance, professionals.length)}
                  </p>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-l-4 border-l-blue-600">
                  <h3 className="font-medium text-blue-800 mb-2">Team Structure</h3>
                  <p className="text-blue-800">
                    Your team consists of {professionals.length} professionals across {Object.keys(roleDistribution).length} different roles.
                    {getRoleDistributionRecommendation(roleDistribution, professionals.length)}
                  </p>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-l-4 border-l-purple-600">
                  <h3 className="font-medium text-purple-800 mb-2">Bonus Strategy</h3>
                  <p className="text-purple-800">
                    {getBonusStrategyRecommendation(
                      highestPerformer ? getCompensationTier(highestPerformer.performance).tier : null,
                      tierDistribution,
                      professionals.length
                    )}
                  </p>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-l-4 border-l-amber-600">
                  <h3 className="font-medium text-amber-800 mb-2">Training & Development Focus</h3>
                  <p className="text-amber-800">
                    {getTrainingRecommendation(lowestMetrics, professionals.length)}
                  </p>
                </div>
                
                {highestPerformingRole && (
                  <div className="p-5 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border-l-4 border-l-pink-600">
                    <h3 className="font-medium text-pink-800 mb-2">Role Excellence Program</h3>
                    <p className="text-pink-800">
                      Your {highestPerformingRole.role} team is performing exceptionally well with an average of {highestPerformingRole.average.toFixed(1)}%.
                      Consider implementing a mentorship program where your top performers in this role can share best practices with other teams.
                      {getRoleExcellenceRecommendation(highestPerformingRole.role, highestPerformingRole.average)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions for recommendations
const totalCompensationByTier = (compensationByTier: Record<number, { salary: number, bonus: number }>) => {
  return Object.values(compensationByTier).reduce((total, { salary, bonus }) => total + salary + bonus, 0);
};

const totalBonusByTier = (compensationByTier: Record<number, { salary: number, bonus: number }>) => {
  return Object.values(compensationByTier).reduce((total, { bonus }) => total + bonus, 0);
};

const getTierDistributionRecommendation = (tierDistribution: Record<number, number>, total: number) => {
  const tier1Percent = total > 0 ? ((tierDistribution[1] || 0) / total) * 100 : 0;
  const tier3Percent = total > 0 ? ((tierDistribution[3] || 0) / total) * 100 : 0;
  
  if (tier1Percent > 50) {
    return " Your organization has a high proportion of top performers, which may indicate excellent recruitment and development processes.";
  } else if (tier3Percent > 50) {
    return " Your organization has a high proportion of tier 3 performers, suggesting a need for targeted training and development programs.";
  } else {
    return " Your compensation budget is distributed relatively evenly across performance tiers.";
  }
};

const getPerformanceRecommendation = (averagePerformance: number, staffCount: number) => {
  if (averagePerformance >= 90) {
    return `Your team's average performance of ${averagePerformance.toFixed(1)}% is excellent. Focus on maintaining this high standard through continued professional development and recognition programs.`;
  } else if (averagePerformance >= 80) {
    return `With an average performance of ${averagePerformance.toFixed(1)}%, your team is performing well. Consider implementing targeted improvement plans for specific metrics to further enhance overall performance.`;
  } else {
    return `Your team's average performance of ${averagePerformance.toFixed(1)}% indicates opportunities for improvement. We recommend conducting a comprehensive skills gap analysis and implementing structured training programs.`;
  }
};

const getRoleDistributionRecommendation = (roleDistribution: Record<string, number>, total: number) => {
  const keys = Object.keys(roleDistribution);
  if (keys.length <= 2 && total >= 5) {
    return " Consider diversifying your team to include more specialized roles for a more balanced skill distribution.";
  } else if (keys.length >= 5 && total <= 10) {
    return " Your team has a diverse set of roles, which may lead to expertise fragmentation with your current team size. Consider focusing on core specialties.";
  } else {
    return " Your role distribution appears well-balanced for your current team size.";
  }
};

const getBonusStrategyRecommendation = (
  topPerformerTier: number | null,
  tierDistribution: Record<number, number>,
  total: number
) => {
  if (topPerformerTier === 1 && total > 3) {
    return "Your bonus structure effectively rewards top performers. Consider implementing an additional spot bonus program for exceptional achievements on specific projects.";
  } else if ((tierDistribution[3] || 0) > (total / 2)) {
    return "A large portion of your team is in the tier 3 compensation level. Consider adjusting bonus thresholds or implementing interim performance goals to create more achievable advancement steps.";
  } else {
    return "Your current three-tier bonus structure provides clear performance incentives. Regular communication about the criteria for advancement between tiers will help motivate staff to improve performance.";
  }
};

const getTrainingRecommendation = (
  lowestMetrics: Array<{
    professionalName: string;
    professionalRole: string;
    metricName: string;
    score: number;
    weight: number;
  }>,
  total: number
) => {
  if (lowestMetrics.length === 0) {
    return "Insufficient metric data to provide targeted training recommendations.";
  }
  
  // Group by metric name to find patterns
  const metricGroups = lowestMetrics.reduce((groups, metric) => {
    if (!groups[metric.metricName]) {
      groups[metric.metricName] = [];
    }
    groups[metric.metricName].push(metric);
    return groups;
  }, {} as Record<string, typeof lowestMetrics>);
  
  const mostCommonMetric = Object.entries(metricGroups)
    .sort((a, b) => b[1].length - a[1].length)[0];
  
  if (mostCommonMetric && mostCommonMetric[1].length > 1) {
    return `We recommend prioritizing training programs focused on improving ${mostCommonMetric[0]}, as it appears to be a common area for improvement across multiple team members.`;
  } else {
    return `Based on the lowest performing metrics, we recommend personalized development plans for each team member, with particular focus on the metrics that carry the highest weights for their respective roles.`;
  }
};

const getRoleExcellenceRecommendation = (role: string, average: number) => {
  switch (role) {
    case 'General Doctor':
      return " Capture their approach to patient satisfaction and clinical outcomes to create best practice guidelines.";
    case 'Radiologist':
      return " Document their diagnostic methodologies to develop a center of excellence for diagnostic imaging.";
    case 'Quality Assurance':
      return " Leverage their systematic approach to develop organization-wide quality management frameworks.";
    case 'Healthcare IT':
      return " Utilize their technical expertise to optimize systems across all departments.";
    case 'Lab Technician':
      return " Standardize their testing protocols to improve laboratory accuracy across the organization.";
    default:
      return " Develop a knowledge sharing system to transfer their expertise to other roles and departments.";
  }
};

export default AIInsights;
