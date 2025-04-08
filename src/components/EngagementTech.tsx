
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Role, Metric, getRoleMetrics, calculatePerformance } from "@/utils/dataTypes";
import { BarChart, Activity, Users, ChartLine } from "lucide-react";

const EngagementTech: React.FC = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("General Doctor");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [overallPerformance, setOverallPerformance] = useState<number | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Initialize metrics when role changes
  React.useEffect(() => {
    const roleMetrics = getRoleMetrics(role);
    const initializedMetrics = roleMetrics.map(metric => ({
      ...metric,
      score: 75 // Default score
    }));
    setMetrics(initializedMetrics);
  }, [role]);

  const handleRoleChange = (value: string) => {
    setRole(value as Role);
    setOverallPerformance(null);
  };

  const handleMetricScoreChange = (index: number, value: number) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index].score = value;
    setMetrics(updatedMetrics);
  };

  const calculateOverallPerformance = () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a professional's name",
        variant: "destructive"
      });
      return;
    }
    
    const performance = calculatePerformance(metrics);
    setOverallPerformance(performance);
    setStep(3);
    
    toast({
      title: "Performance Calculated",
      description: `Overall performance for ${name}: ${performance.toFixed(1)}%`,
    });
  };

  const resetCalculation = () => {
    setName("");
    setRole("General Doctor");
    setOverallPerformance(null);
    setStep(1);
  };
  
  const goToNextStep = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 1) {
      toast({
        title: "Name Required",
        description: "Please enter a professional's name",
        variant: "destructive"
      });
    } else if (step === 2) {
      calculateOverallPerformance();
    }
  };

  const goToPreviousStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
        <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-healthcare-primary" />
            Engagement Tech Performance Calculator
          </CardTitle>
          <CardDescription>
            Calculate the overall performance of healthcare professionals based on role-specific metrics
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name">Professional's Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={handleRoleChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Doctor">General Doctor</SelectItem>
                    <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                    <SelectItem value="Radiologist">Radiologist</SelectItem>
                    <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                    <SelectItem value="Healthcare IT">Healthcare IT</SelectItem>
                    <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={goToNextStep} className="bg-healthcare-primary hover:bg-healthcare-accent">
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{name} - {role}</h3>
              </div>
              
              <div className="space-y-6">
                {metrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <Label>
                        {metric.name} 
                        <span className="text-xs text-muted-foreground ml-1">
                          (Weight: {metric.weight}%)
                        </span>
                      </Label>
                      <span className="font-medium">{metric.score}</span>
                    </div>
                    <Slider
                      value={[metric.score]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleMetricScoreChange(index, value[0])}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  Back
                </Button>
                <Button onClick={calculateOverallPerformance} className="bg-healthcare-primary hover:bg-healthcare-accent">
                  Calculate Performance
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && overallPerformance !== null && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center py-6">
                <div className="text-lg font-medium mb-1">Performance Result</div>
                <div className="text-3xl font-bold text-healthcare-primary">
                  {overallPerformance.toFixed(1)}%
                </div>
                <div className="mt-4 max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-healthcare-primary h-4 rounded-full transition-all duration-1000" 
                      style={{ width: `${overallPerformance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Performance Summary</h4>
                <p className="text-sm">
                  Based on the role-specific metrics for {role}, {name} has an overall performance 
                  score of {overallPerformance.toFixed(1)}%.
                </p>
                {metrics.map((metric, index) => (
                  <div key={index} className="mt-2 text-sm">
                    <span className="font-medium">{metric.name}:</span> {metric.score}/100
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={goToPreviousStep}>
                  Edit Metrics
                </Button>
                <Button onClick={resetCalculation}>
                  Start New Calculation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementTech;
