
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserX, 
  UserCheck, 
  Download,
  FileText,
  Printer
} from "lucide-react";
import { Professional } from "@/utils/dataTypes";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ProfessionalManagementProps {
  professional: Professional;
  onFireProfessional: (id: string) => void;
  onSendFeedback: (id: string, feedback: string) => void;
}

const ProfessionalManagement: React.FC<ProfessionalManagementProps> = ({
  professional,
  onFireProfessional,
  onSendFeedback
}) => {
  const { toast } = useToast();
  const [isFireDialogOpen, setIsFireDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [reportType, setReportType] = useState<'performance' | 'skills' | 'metrics'>('performance');

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      toast({
        title: "Error",
        description: "Please enter feedback before sending",
        variant: "destructive"
      });
      return;
    }
    
    onSendFeedback(professional.id, feedback);
    
    toast({
      title: "Feedback Sent",
      description: `Feedback has been sent to ${professional.name}`,
      variant: "default"
    });
    
    setFeedback('');
    setIsFeedbackDialogOpen(false);
  };

  const handleFireProfessional = () => {
    onFireProfessional(professional.id);
    
    toast({
      title: "Professional Removed",
      description: `${professional.name} has been removed from the system`,
      variant: "default"
    });
    
    setIsFireDialogOpen(false);
  };

  const handlePrintReport = () => {
    window.print();
    
    toast({
      title: "Report Printed",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for ${professional.name} sent to printer`,
      variant: "default"
    });
  };

  const handleDownloadReport = () => {
    // In a real app, this would generate a downloadable report
    toast({
      title: "Report Downloaded",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for ${professional.name} has been downloaded`,
      variant: "default"
    });
  };

  const generateFeedbackSuggestion = () => {
    // Generate suggestions based on professional's metrics
    let suggestions: string[] = [];
    
    // Check for low performance
    if (professional.performance < 70) {
      suggestions.push("Your overall performance score indicates room for improvement. We suggest focusing on increasing your efficiency and quality of work.");
    }
    
    // Check for low AI usage if performance is also not great
    if (professional.aiUsage < 40 && professional.performance < 80) {
      suggestions.push("Your AI tool usage is below average. Consider utilizing our AI tools more frequently to improve efficiency and outcomes.");
    }
    
    // Check individual metrics
    const lowMetrics = professional.metrics.filter(metric => metric.score < 70);
    if (lowMetrics.length > 0) {
      suggestions.push(`We've identified areas that need attention: ${lowMetrics.map(m => m.name).join(', ')}. Consider additional training in these areas.`);
    }
    
    // Check skills
    const lowSkills = professional.skills.filter(skill => skill.level < 60);
    if (lowSkills.length > 0) {
      suggestions.push(`Your proficiency in ${lowSkills.map(s => s.name).join(', ')} could be improved. We offer resources and workshops to help develop these skills.`);
    }
    
    // If everything is good
    if (suggestions.length === 0) {
      suggestions.push(`Your performance is excellent across all metrics. Keep up the great work! Consider mentoring others in ${professional.skills[0]?.name || 'your area of expertise'}.`);
    }
    
    return suggestions.join('\n\n');
  };

  const renderReportContent = () => {
    switch(reportType) {
      case 'performance':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Overview</h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-xl font-bold">{professional.performance.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Overall Performance Score</div>
            </div>
            <p className="text-sm">
              This report shows the overall performance of {professional.name} based on weighted metrics.
              {professional.performance >= 80 ? ' Performance is excellent.' : 
               professional.performance >= 70 ? ' Performance is good but has room for improvement.' : 
               ' Performance needs significant improvement.'}
            </p>
          </div>
        );
      
      case 'skills':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Skills Assessment</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Proficiency Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professional.skills.map((skill, index) => (
                  <TableRow key={index}>
                    <TableCell>{skill.name}</TableCell>
                    <TableCell>{skill.level}%</TableCell>
                    <TableCell>
                      {skill.level >= 80 ? 'Expert' : 
                       skill.level >= 60 ? 'Proficient' : 
                       skill.level >= 40 ? 'Intermediate' : 'Beginner'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      
      case 'metrics':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Metrics</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professional.metrics.map((metric, index) => (
                  <TableRow key={index}>
                    <TableCell>{metric.name}</TableCell>
                    <TableCell>{metric.score}%</TableCell>
                    <TableCell>{metric.weight}%</TableCell>
                    <TableCell className="text-sm text-gray-600">{metric.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
    }
  };

  return (
    <>
      <Card className="mt-6 overflow-hidden border-t-4 border-t-healthcare-primary">
        <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
          <CardTitle className="text-xl font-bold">Professional Management</CardTitle>
          <CardDescription>Generate reports, provide feedback, or manage professional status</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Report Generator */}
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-healthcare-primary" />
                Generate Professional Report
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Report Type
                    </label>
                    <Select 
                      value={reportType}
                      onValueChange={(value: 'performance' | 'skills' | 'metrics') => setReportType(value)}
                    >
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance Overview</SelectItem>
                        <SelectItem value="skills">Skills Assessment</SelectItem>
                        <SelectItem value="metrics">Performance Metrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-white">
                    {renderReportContent()}
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={handlePrintReport}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Report
                    </Button>
                    <Button onClick={handleDownloadReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-initial" 
                onClick={() => setIsFeedbackDialogOpen(true)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Send Feedback & Suggestions
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 sm:flex-initial" 
                onClick={() => setIsFireDialogOpen(true)}
              >
                <UserX className="h-4 w-4 mr-2" />
                Remove Professional
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Feedback & Suggestions</DialogTitle>
            <DialogDescription>
              Provide constructive feedback and suggestions to help {professional.name} improve.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFeedback(generateFeedbackSuggestion())}
              className="mb-2"
            >
              Generate Suggestions
            </Button>
            
            <Textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback and suggestions here..."
              rows={8}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendFeedback}>
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Fire Professional Dialog */}
      <Dialog open={isFireDialogOpen} onOpenChange={setIsFireDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Remove Professional</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {professional.name} from the system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-red-50 p-4 rounded border border-red-200 text-red-700 text-sm">
              <p className="font-medium">Warning:</p>
              <p>This will permanently remove the professional's records, performance data, and access to the system.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFireDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleFireProfessional}>
              Confirm Removal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfessionalManagement;
