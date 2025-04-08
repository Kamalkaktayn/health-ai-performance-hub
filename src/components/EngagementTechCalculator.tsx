
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Professional, Metric, getRoleMetrics, calculatePerformance } from "@/utils/dataTypes";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Form schema for validation
const formSchema = z.object({
  role: z.enum(['General Doctor', 'Psychiatrist', 'Radiologist', 'Quality Assurance', 'Healthcare IT', 'Lab Technician']),
});

interface EngagementTechCalculatorProps {
  professional?: Professional;
}

const EngagementTechCalculator: React.FC<EngagementTechCalculatorProps> = ({ professional }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [performance, setPerformance] = useState<number>(0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: professional?.role || 'General Doctor',
    },
  });

  // Load initial metrics when role changes
  useEffect(() => {
    const role = form.getValues().role;
    const roleMetrics = getRoleMetrics(role).map(metric => ({
      ...metric,
      score: professional?.metrics.find(m => m.name === metric.name)?.score || 50
    }));
    setMetrics(roleMetrics);
    calculateOverallPerformance(roleMetrics);
  }, [form.watch('role'), professional]);

  // Update a specific metric's score
  const updateMetricScore = (index: number, value: number) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index] = { ...updatedMetrics[index], score: value };
    setMetrics(updatedMetrics);
    calculateOverallPerformance(updatedMetrics);
  };

  // Calculate the overall performance based on metrics
  const calculateOverallPerformance = (currentMetrics: Metric[]) => {
    const result = calculatePerformance(currentMetrics);
    setPerformance(result);
  };

  // Reset all metrics to default values
  const resetMetrics = () => {
    const role = form.getValues().role;
    const roleMetrics = getRoleMetrics(role).map(metric => ({
      ...metric,
      score: 50 // Default score
    }));
    setMetrics(roleMetrics);
    calculateOverallPerformance(roleMetrics);
    
    toast({
      title: "Metrics Reset",
      description: "All metrics have been reset to default values.",
      variant: "default"
    });
  };

  // Generate performance report
  const generateReport = () => {
    toast({
      title: "Performance Report Generated",
      description: `Overall Performance: ${performance.toFixed(1)}%`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Engagement Tech Performance Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Healthcare Role</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset metrics when role changes
                        const roleMetrics = getRoleMetrics(value as any).map(metric => ({
                          ...metric,
                          score: 50
                        }));
                        setMetrics(roleMetrics);
                        calculateOverallPerformance(roleMetrics);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General Doctor">General Doctor</SelectItem>
                        <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                        <SelectItem value="Radiologist">Radiologist</SelectItem>
                        <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                        <SelectItem value="Healthcare IT">Healthcare IT</SelectItem>
                        <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
            <div className="space-y-6">
              {metrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{metric.name}</p>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                    <Badge variant="outline">Weight: {metric.weight}%</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Slider
                        value={[metric.score]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => updateMetricScore(index, values[0])}
                      />
                    </div>
                    <div className="w-12 text-right">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={metric.score}
                        onChange={(e) => updateMetricScore(index, parseInt(e.target.value) || 0)}
                        className="w-16"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Overall Performance</h3>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Score</span>
              <span className="font-bold">{performance.toFixed(1)}%</span>
            </div>
            <Progress value={performance} className="h-3" />
            <div className="mt-6 flex justify-between flex-wrap gap-2">
              <Button variant="outline" onClick={resetMetrics}>Reset Metrics</Button>
              <Button onClick={generateReport}>Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementTechCalculator;
