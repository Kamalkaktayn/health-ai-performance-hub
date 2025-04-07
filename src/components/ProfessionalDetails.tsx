import React, { useState } from 'react';
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
  Trophy,
  Mail,
  Phone,
  GraduationCap,
  BrainCircuit,
  Sparkles,
  Clock,
  Lightbulb,
  ClipboardList,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  AIRecommendation, 
  Professional, 
  getRecommendations, 
  getCompensationTier,
  Skill
} from "@/utils/dataTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfessionalDialog from "./EditProfessionalDialog";

interface ProfessionalDetailsProps {
  professional: Professional;
  onProfessionalUpdate?: (updatedProfessional: Professional) => void;
}

const ProfessionalDetails: React.FC<ProfessionalDetailsProps> = ({ 
  professional,
  onProfessionalUpdate 
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<Professional>(professional);
  
  const recommendations: AIRecommendation[] = getRecommendations(currentProfessional.metrics, currentProfessional.role);
  const compensationTier = getCompensationTier(currentProfessional.performance);
  
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };
  
  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };
  
  const handleSaveChanges = (updatedProfessional: Professional) => {
    setCurrentProfessional(updatedProfessional);
    
    // If parent component provided update handler, call it
    if (onProfessionalUpdate) {
      onProfessionalUpdate(updatedProfessional);
    }
    
    toast({
      title: "Profile Updated",
      description: `${updatedProfessional.name}'s profile has been updated successfully.`,
    });
  };
  
  const renderTrendIcon = () => {
    switch (currentProfessional.trend) {
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

  const getSkillColor = (level: number) => {
    if (level >= 90) return "bg-green-500";
    if (level >= 80) return "bg-blue-500";
    if (level >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAIUsageSuggestion = () => {
    const { aiUsage, role } = currentProfessional;
    
    if (role === 'General Doctor') {
      if (aiUsage <= 30) {
        return {
          level: 'low',
          text: "Try using AI tools in diagnosis and documentation."
        };
      } else if (aiUsage <= 70) {
        return {
          level: 'medium',
          text: "Nice work! Consider using AI in follow-ups too."
        };
      } else {
        return {
          level: 'high',
          text: "Excellent adoption! You're leading in innovation."
        };
      }
    } else if (role === 'Radiologist') {
      if (aiUsage <= 30) {
        return {
          level: 'low',
          text: "Try using AI for preliminary scans to save time."
        };
      } else if (aiUsage <= 70) {
        return {
          level: 'medium',
          text: "Good integration. Use AI in more routine scans."
        };
      } else {
        return {
          level: 'high',
          text: "Power user! Share your process with peers."
        };
      }
    } else if (role === 'Lab Technician') {
      if (aiUsage <= 30) {
        return {
          level: 'low',
          text: "Try integrating AI for sample analysis and reporting."
        };
      } else if (aiUsage <= 70) {
        return {
          level: 'medium',
          text: "Good job! Consider using AI for quality control too."
        };
      } else {
        return {
          level: 'high',
          text: "Excellent! You're maximizing efficiency with AI tools."
        };
      }
    } else if (role === 'Healthcare IT') {
      if (aiUsage <= 30) {
        return {
          level: 'low',
          text: "Prioritize critical AI integrations for doctors/labs."
        };
      } else if (aiUsage <= 70) {
        return {
          level: 'medium',
          text: "Good work! Scale AI pilots to more departments."
        };
      } else {
        return {
          level: 'high',
          text: "Excellent! You're driving digital transformation."
        };
      }
    } else {
      if (aiUsage <= 30) {
        return {
          level: 'low',
          text: "Consider exploring AI tools to enhance your workflow."
        };
      } else if (aiUsage <= 70) {
        return {
          level: 'medium',
          text: "Good adoption of AI tools. Look for additional use cases."
        };
      } else {
        return {
          level: 'high',
          text: "Excellent tech adoption! Share your insights with colleagues."
        };
      }
    }
  };

  const getPerformanceSuggestions = () => {
    const suggestions = [];
    
    if (['General Doctor', 'Psychiatrist'].includes(currentProfessional.role)) {
      const patientMetric = currentProfessional.metrics.find(m => 
        m.name.includes('Patient') || m.name.includes('Satisfaction')
      );
      
      if (patientMetric) {
        const score = patientMetric.score;
        if (score < 60) {
          suggestions.push({
            title: "Patient Interaction Quality",
            level: 'low',
            text: "Consider communication training for better patient satisfaction."
          });
        } else if (score <= 80) {
          suggestions.push({
            title: "Patient Interaction Quality",
            level: 'medium',
            text: "Good job! Continue improving clarity and empathy."
          });
        } else {
          suggestions.push({
            title: "Patient Interaction Quality",
            level: 'high',
            text: "Outstanding! Keep up the great work."
          });
        }
      }
    }
    
    if (currentProfessional.role === 'Radiologist') {
      const tatMetric = currentProfessional.metrics.find(m => m.name.includes('Turnaround'));
      
      if (tatMetric) {
        const score = tatMetric.score;
        if (score < 60) {
          suggestions.push({
            title: "Turnaround Time (TAT)",
            level: 'low',
            text: "Consider automation to speed up processing."
          });
        } else if (score <= 80) {
          suggestions.push({
            title: "Turnaround Time (TAT)",
            level: 'medium',
            text: "Optimize workflow for quicker turnarounds."
          });
        } else {
          suggestions.push({
            title: "Turnaround Time (TAT)",
            level: 'high',
            text: "Excellent speed! You're setting a benchmark."
          });
        }
      }
    }
    
    if (currentProfessional.role === 'Lab Technician') {
      const documentationMetric = currentProfessional.metrics.find(m => m.name.includes('Documentation'));
      
      if (documentationMetric) {
        const score = documentationMetric.score;
        if (score < 60) {
          suggestions.push({
            title: "Digital Documentation Completion",
            level: 'low',
            text: "Adopt digital templates for faster input."
          });
        } else if (score <= 85) {
          suggestions.push({
            title: "Digital Documentation Completion",
            level: 'medium',
            text: "Use voice-to-text tools to improve speed."
          });
        } else {
          suggestions.push({
            title: "Digital Documentation Completion",
            level: 'high',
            text: "Impressive! Your digital work is top-notch."
          });
        }
      }
    }
    
    if (currentProfessional.role === 'Healthcare IT') {
      const implementationMetric = currentProfessional.metrics.find(m => 
        m.name.includes('Project') || m.name.includes('Delivery')
      );
      
      if (implementationMetric) {
        const score = implementationMetric.score;
        if (score < 60) {
          suggestions.push({
            title: "AI Implementation Rate",
            level: 'low',
            text: "Focus on completing critical AI implementations first."
          });
        } else if (score <= 80) {
          suggestions.push({
            title: "AI Implementation Rate",
            level: 'medium',
            text: "Good work! Scale successful AI pilots to more departments."
          });
        } else {
          suggestions.push({
            title: "AI Implementation Rate",
            level: 'high',
            text: "Excellent delivery rate! Share your project management approach."
          });
        }
      }
    }
    
    const lowestMetric = [...currentProfessional.metrics].sort((a, b) => a.score - b.score)[0];
    if (lowestMetric && lowestMetric.score < 75) {
      suggestions.push({
        title: lowestMetric.name,
        level: 'low',
        text: `Focus on improving ${lowestMetric.name} through targeted training and mentorship.`
      });
    }
    
    return suggestions;
  };
  
  const aiUsageSuggestion = getAIUsageSuggestion();
  const performanceSuggestions = getPerformanceSuggestions();
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
        <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">{currentProfessional.name}</CardTitle>
              <CardDescription className="flex flex-col space-y-1">
                <span>{currentProfessional.role} - {currentProfessional.department}</span>
                <span className="flex items-center text-sm">
                  <Mail className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  {currentProfessional.email}
                </span>
                {currentProfessional.phone && (
                  <span className="flex items-center text-sm">
                    <Phone className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    {currentProfessional.phone}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                <PenLine className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
              <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gradient-to-br from-healthcare-light to-white p-6 rounded-lg flex flex-col items-center justify-center shadow-md">
                  <div className="relative mb-2">
                    <PieChart className="h-16 w-16 text-healthcare-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{currentProfessional.performance.toFixed(1)}%</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium">Overall Performance</h3>
                  <div className="flex items-center mt-2 text-sm">
                    {renderTrendIcon()}
                    <span className="ml-1">
                      {currentProfessional.trend === 'up' ? 'Improving' : 
                      currentProfessional.trend === 'down' ? 'Declining' : 'Stable'}
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
                      {currentProfessional.metrics.sort((a, b) => b.score - a.score).slice(0, 2).map((metric, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                          <span>Strongest in <span className="font-medium">{metric.name}</span> ({metric.score}%)</span>
                        </li>
                      ))}
                      {currentProfessional.metrics.sort((a, b) => a.score - b.score).slice(0, 1).map((metric, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4 text-red-500 rotate-180" />
                          <span>Needs improvement in <span className="font-medium">{metric.name}</span> ({metric.score}%)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-medium">AI Integration</h3>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">AI Usage</span>
                      <span className="font-bold text-lg">{currentProfessional.aiUsage}%</span>
                    </div>
                    <Progress 
                      value={currentProfessional.aiUsage} 
                      className="h-2.5 bg-purple-100"
                    />
                    <p className="text-sm mt-2 text-gray-600">
                      {currentProfessional.aiUsage >= 80 ? "Heavy AI user" : 
                       currentProfessional.aiUsage >= 60 ? "Moderate AI user" : 
                       "Light AI user"}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium">Experience</h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">{currentProfessional.yearsOfExperience} years</span>
                    <span className="text-sm text-gray-600">in {currentProfessional.role} role</span>
                    {currentProfessional.education && (
                      <div className="mt-2 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm">{currentProfessional.education}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-medium">Certifications</h3>
                  </div>
                  <ul className="space-y-2">
                    {currentProfessional.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center">
                        <Badge variant="outline" className="mr-2 bg-amber-50">
                          <Award className="h-3 w-3 mr-1 text-amber-500" />
                        </Badge>
                        <span className="text-sm">{cert}</span>
                      </li>
                    ))}
                  </ul>
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
            
            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProfessional.skills.map((skill, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold">{skill.level}%</span>
                      </div>
                    </div>
                    <Progress 
                      value={skill.level} 
                      className="h-2.5 mb-2 bg-gray-100"
                    />
                    <div className="flex mt-2 justify-between">
                      <span className="text-xs text-gray-500">Beginner</span>
                      <span className="text-xs text-gray-500">Intermediate</span>
                      <span className="text-xs text-gray-500">Advanced</span>
                      <span className="text-xs text-gray-500">Expert</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">AI Skill Development Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentProfessional.skills
                      .filter(skill => skill.level < 80)
                      .slice(0, 2)
                      .map((skill, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-700">Improve {skill.name} Proficiency</h4>
                        <p className="text-sm mt-1">
                          Our AI recommends targeted training to improve {skill.name.toLowerCase()} skills. 
                          Consider enrolling in our virtual training program to enhance proficiency.
                        </p>
                      </div>
                    ))}
                    {currentProfessional.aiUsage < 60 && (
                      <div className="p-3 bg-purple-50 rounded-md">
                        <h4 className="font-medium text-purple-700">Increase AI Tool Adoption</h4>
                        <p className="text-sm mt-1">
                          This professional could benefit from greater AI tool adoption in their workflow.
                          Consider scheduling an AI tools training session.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="suggestions" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4">
                    <div className="flex items-center">
                      <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
                      <CardTitle className="text-lg">AI-Powered Performance Suggestions</CardTitle>
                    </div>
                    <CardDescription>
                      Tailored recommendations based on {currentProfessional.name}'s performance data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-md font-medium flex items-center mb-3">
                        <BrainCircuit className="h-5 w-5 text-purple-500 mr-2" />
                        AI Technology Adoption
                      </h3>
                      
                      <div className={`suggestion-card suggestion-card-${aiUsageSuggestion.level}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {aiUsageSuggestion.level === 'low' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                              {aiUsageSuggestion.level === 'medium' && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
                              {aiUsageSuggestion.level === 'high' && <Trophy className="h-5 w-5 text-green-500" />}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium">AI Usage Rate: {currentProfessional.aiUsage}%</h4>
                              <p className="text-sm mt-1">{aiUsageSuggestion.text}</p>
                            </div>
                          </div>
                          <Badge className={
                            aiUsageSuggestion.level === 'low' ? "bg-orange-100 text-orange-800 hover:bg-orange-100" :
                            aiUsageSuggestion.level === 'medium' ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                            "bg-green-100 text-green-800 hover:bg-green-100"
                          }>
                            {aiUsageSuggestion.level === 'low' ? 'Needs Improvement' : 
                             aiUsageSuggestion.level === 'medium' ? 'Good' : 'Excellent'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium flex items-center mb-3">
                        <ClipboardList className="h-5 w-5 text-blue-500 mr-2" />
                        Performance Areas
                      </h3>
                      
                      {performanceSuggestions.map((suggestion, index) => (
                        <div key={index} className={`suggestion-card suggestion-card-${suggestion.level}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {suggestion.level === 'low' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                                {suggestion.level === 'medium' && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
                                {suggestion.level === 'high' && <Trophy className="h-5 w-5 text-green-500" />}
                              </div>
                              <div className="ml-3">
                                <h4 className="font-medium">{suggestion.title}</h4>
                                <p className="text-sm mt-1">{suggestion.text}</p>
                              </div>
                            </div>
                            <Badge className={
                              suggestion.level === 'low' ? "bg-orange-100 text-orange-800 hover:bg-orange-100" :
                              suggestion.level === 'medium' ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                              "bg-green-100 text-green-800 hover:bg-green-100"
                            }>
                              {suggestion.level === 'low' ? 'Needs Improvement' : 
                               suggestion.level === 'medium' ? 'Good' : 'Excellent'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {performanceSuggestions.length === 0 && (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                          <Sparkles className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                          <p>No specific performance suggestions at this time.</p>
                          <p className="text-sm mt-1">All metrics are meeting or exceeding expectations.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProfessional.metrics.map((metric, index) => (
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
                      className="h-2.5 mb-2 bg-gray-100"
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
                    <div className="text-xl font-bold">${currentProfessional.salary.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-5 border rounded-lg bg-gradient-to-br from-white to-healthcare-light shadow-md">
                    <div className="text-sm text-muted-foreground">Performance Bonus</div>
                    <div className="text-xl font-bold text-healthcare-primary">
                      ${currentProfessional.bonus.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(compensationTier.bonusPercentage * 100).toFixed(0)}% of base salary
                    </div>
                  </div>
                  
                  <div className={`p-5 rounded-lg shadow-md ${getTierColor(compensationTier.tier)}`}>
                    <div className="text-sm opacity-90">Total Compensation</div>
                    <div className="text-xl font-bold">
                      ${(currentProfessional.salary + currentProfessional.bonus).toLocaleString(undefined, {maximumFractionDigits: 0})}
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
      
      <EditProfessionalDialog 
        professional={currentProfessional}
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default ProfessionalDetails;
