
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BrainCircuit, 
  Lightbulb, 
  ClipboardList, 
  AlertCircle, 
  CheckCircle2, 
  Trophy 
} from "lucide-react";
import { Professional } from "@/utils/dataTypes";

interface ProfessionalSuggestionsProps {
  professional: Professional;
}

const ProfessionalSuggestions: React.FC<ProfessionalSuggestionsProps> = ({ professional }) => {
  // AI Usage suggestion based on percentage and role
  const getAIUsageSuggestion = () => {
    const { aiUsage, role } = professional;
    
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

  // Performance suggestion based on professional's role and metrics
  const getPerformanceSuggestions = () => {
    const suggestions = [];
    
    // Patient interaction quality for doctors
    if (['General Doctor', 'Psychiatrist'].includes(professional.role)) {
      const patientMetric = professional.metrics.find(m => 
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
    
    // Turnaround time for Radiologists
    if (professional.role === 'Radiologist') {
      const tatMetric = professional.metrics.find(m => m.name.includes('Turnaround'));
      
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
    
    // Lab Technician specific suggestions
    if (professional.role === 'Lab Technician') {
      const documentationMetric = professional.metrics.find(m => m.name.includes('Documentation'));
      
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
    
    // Healthcare IT specific suggestions
    if (professional.role === 'Healthcare IT') {
      const implementationMetric = professional.metrics.find(m => 
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
    
    // Generic suggestion based on lowest metric
    const lowestMetric = [...professional.metrics].sort((a, b) => a.score - b.score)[0];
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
      <Card className="overflow-hidden border-t-4 border-t-indigo-600">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-white pb-4">
          <div className="flex items-center">
            <Lightbulb className="h-6 w-6 text-amber-500 mr-2" />
            <CardTitle className="text-lg">AI-Powered Performance Suggestions</CardTitle>
          </div>
          <CardDescription>
            Tailored recommendations based on {professional.name}'s performance data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-md font-medium flex items-center mb-3">
              <BrainCircuit className="h-5 w-5 text-purple-500 mr-2" />
              AI Technology Adoption
            </h3>
            
            <div className={`p-4 rounded-lg border mb-4 ${
              aiUsageSuggestion.level === 'low' ? 'bg-orange-50 border-orange-200' : 
              aiUsageSuggestion.level === 'medium' ? 'bg-blue-50 border-blue-200' : 
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {aiUsageSuggestion.level === 'low' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                    {aiUsageSuggestion.level === 'medium' && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
                    {aiUsageSuggestion.level === 'high' && <Trophy className="h-5 w-5 text-green-500" />}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">AI Usage Rate: {professional.aiUsage}%</h4>
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
            
            <div className="space-y-4">
              {performanceSuggestions.map((suggestion, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  suggestion.level === 'low' ? 'bg-orange-50 border-orange-200' : 
                  suggestion.level === 'medium' ? 'bg-blue-50 border-blue-200' : 
                  'bg-green-50 border-green-200'
                }`}>
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
                  <Trophy className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p>No specific performance suggestions at this time.</p>
                  <p className="text-sm mt-1">All metrics are meeting or exceeding expectations.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalSuggestions;
