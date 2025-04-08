
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Role, Metric, getRoleMetrics, calculatePerformance } from "@/utils/dataTypes";
import { BarChart, Activity, Users, ChartLine, Calendar, Mail, Video, Bell, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const EngagementTech: React.FC = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("General Doctor");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [overallPerformance, setOverallPerformance] = useState<number | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [aiUsageExceeded, setAiUsageExceeded] = useState<boolean>(false);
  const [isNewEmployee, setIsNewEmployee] = useState<boolean>(false);
  const [showInterviewOption, setShowInterviewOption] = useState<boolean>(false);
  const [showOverqualifiedAlert, setShowOverqualifiedAlert] = useState<boolean>(false);
  const [interviewDialogOpen, setInterviewDialogOpen] = useState<boolean>(false);
  const [interviewScheduled, setInterviewScheduled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Form schema for interview scheduling
  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    date: z.date({ required_error: "Please select a date for the interview" }),
    time: z.string().min(1, { message: "Please select a time" }),
    method: z.string().min(1, { message: "Please select an interview method" }),
    notes: z.string().optional(),
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      time: "10:00",
      method: "video",
      notes: "",
    },
  });

  // Initialize metrics when role changes
  React.useEffect(() => {
    const roleMetrics = getRoleMetrics(role);
    const initializedMetrics = roleMetrics.map(metric => ({
      ...metric,
      score: 75 // Default score
    }));
    setMetrics(initializedMetrics);
    
    // Reset states when role changes
    setAiUsageExceeded(false);
    setOverallPerformance(null);
  }, [role]);

  const handleRoleChange = (value: string) => {
    setRole(value as Role);
    setOverallPerformance(null);
    setShowInterviewOption(false);
    setShowOverqualifiedAlert(false);
  };

  const handleMetricScoreChange = (index: number, value: number) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index].score = value;
    
    // Check if AI Usage metric is over 90%
    if (updatedMetrics[index].name === "AI Usage" && value > 90) {
      setAiUsageExceeded(true);
    } else if (updatedMetrics[index].name === "AI Usage" && value <= 90) {
      setAiUsageExceeded(false);
    }
    
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
    
    // Check performance score for conditional actions
    if (performance >= 85 && performance <= 95) {
      setShowInterviewOption(true);
      setShowOverqualifiedAlert(false);
    } else if (performance > 95) {
      setShowOverqualifiedAlert(true);
      setShowInterviewOption(false);
    } else {
      setShowInterviewOption(false);
      setShowOverqualifiedAlert(false);
    }
    
    toast({
      title: "Performance Calculated",
      description: `Overall performance for ${name}: ${performance.toFixed(1)}%`,
    });
  };
  
  const handleInterviewSchedule = (values: z.infer<typeof formSchema>) => {
    const formattedDate = format(values.date, "yyyy-MM-dd");
    const dateTimeString = `${formattedDate} at ${values.time}`;
    
    setInterviewScheduled(true);
    setInterviewDialogOpen(false);
    setEmployeeEmail(values.email);
    setInterviewDate(dateTimeString);
    
    // Simulate sending calendar invite
    console.log("Sending calendar invite to:", values.email);
    console.log("Interview details:", {
      date: formattedDate,
      time: values.time,
      method: values.method,
      notes: values.notes
    });
    
    // Show success notification
    toast({
      title: "Interview Scheduled",
      description: `Interview scheduled with ${name} on ${dateTimeString}. Calendar invitation sent to ${values.email}.`,
    });
  };
  
  const handleManualTerminationReview = () => {
    toast({
      title: "Review Initiated",
      description: `Manual review initiated for ${name} due to excessive AI usage.`,
    });
  };

  const resetCalculation = () => {
    setName("");
    setRole("General Doctor");
    setOverallPerformance(null);
    setAiUsageExceeded(false);
    setShowInterviewOption(false);
    setShowOverqualifiedAlert(false);
    setInterviewScheduled(false);
    setIsNewEmployee(false);
    setStep(1);
    form.reset();
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
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calculator">Performance Calculator</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="ai-usage">AI Usage Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
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
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="newEmployee">New Employee Evaluation</Label>
                      <input
                        type="checkbox"
                        id="newEmployee"
                        checked={isNewEmployee}
                        onChange={(e) => setIsNewEmployee(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    {isNewEmployee && (
                      <p className="text-sm text-muted-foreground">
                        This evaluation will be used for the onboarding process and initial engagement assessment.
                      </p>
                    )}
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
                    {isNewEmployee && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        New Employee
                      </span>
                    )}
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
                          <span className={`font-medium ${
                            metric.name === "AI Usage" && metric.score > 90 
                              ? "text-red-500" 
                              : ""
                          }`}>
                            {metric.score}
                          </span>
                        </div>
                        <Slider
                          value={[metric.score]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleMetricScoreChange(index, value[0])}
                          className={`py-2 ${
                            metric.name === "AI Usage" && metric.score > 90 
                              ? "accent-red-500" 
                              : ""
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                        
                        {metric.name === "AI Usage" && metric.score > 90 && (
                          <Alert variant="destructive" className="mt-2">
                            <Bell className="h-4 w-4" />
                            <AlertTitle>High AI Usage Detected</AlertTitle>
                            <AlertDescription>
                              This professional's AI usage exceeds recommended limits (90%). This will
                              require a manual review by management.
                            </AlertDescription>
                          </Alert>
                        )}
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
                  
                  {showOverqualifiedAlert && (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-5 w-5 text-green-600" />
                      <AlertTitle className="text-green-800">Overqualified!</AlertTitle>
                      <AlertDescription className="text-green-700">
                        This professional has exceeded expectations with a performance score over 95%.
                        Consider placing them in advanced roles or mentorship positions.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {showInterviewOption && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-blue-800 flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Interview Recommended
                        </CardTitle>
                        <CardDescription className="text-blue-600">
                          This professional's score ({overallPerformance.toFixed(1)}%) qualifies them for an interview process.
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        {!interviewScheduled ? (
                          <Dialog open={interviewDialogOpen} onOpenChange={setInterviewDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="border-blue-300 text-blue-700">
                                Schedule Interview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Schedule Interview</DialogTitle>
                                <DialogDescription>
                                  Set up an interview with {name} to discuss their performance and potential.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleInterviewSchedule)} className="space-y-4 py-4">
                                  <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                          <Input placeholder="employee@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col">
                                        <FormLabel>Interview Date</FormLabel>
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                          <PopoverTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="justify-start text-left font-normal"
                                            >
                                              <Calendar className="mr-2 h-4 w-4" />
                                              {field.value ? (
                                                format(field.value, "PPP")
                                              ) : (
                                                <span>Select date</span>
                                              )}
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                              mode="single"
                                              selected={field.value}
                                              onSelect={(date) => {
                                                field.onChange(date);
                                                setCalendarOpen(false);
                                              }}
                                              disabled={(date) =>
                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                              }
                                              initialFocus
                                            />
                                          </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Interview Time</FormLabel>
                                        <FormControl>
                                          <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name="method"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Interview Method</FormLabel>
                                        <Select 
                                          onValueChange={field.onChange} 
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="video">Video Conference</SelectItem>
                                            <SelectItem value="in-person">In Person</SelectItem>
                                            <SelectItem value="phone">Phone Call</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Additional Notes (Optional)</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Any special instructions or agenda items" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <DialogFooter className="pt-4">
                                    <Button variant="outline" type="button" onClick={() => setInterviewDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button type="submit">
                                      Send Calendar Invitation
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <div className="flex items-center gap-2 text-blue-700">
                            <Check className="h-4 w-4" />
                            <span>Interview scheduled</span>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  )}
                  
                  {aiUsageExceeded && (
                    <Card className="border-amber-200 bg-amber-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-amber-800 flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Manual Review Required
                        </CardTitle>
                        <CardDescription className="text-amber-600">
                          This professional's AI usage exceeds 90%, requiring manual review by management.
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        <Button variant="outline" className="border-amber-300 text-amber-700" onClick={handleManualTerminationReview}>
                          Initiate Review Process
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                  
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
        </TabsContent>
        
        <TabsContent value="interviews">
          <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
            <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-healthcare-primary" />
                Interview Management
              </CardTitle>
              <CardDescription>
                Schedule and manage interviews with qualified professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {interviewScheduled ? (
                <Card className="mt-6 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base">Upcoming Interview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Professional</p>
                          <p>{name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Email</p>
                          <p>{employeeEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Date & Time</p>
                          <p>{interviewDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Status</p>
                          <p className="text-green-600 font-medium">Confirmed</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-medium mb-2">Calendar Invitation</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          A calendar invitation has been sent to the professional's email. You'll both receive email notifications and calendar reminders.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-end border-t">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Send Reminder
                    </Button>
                    <Button size="sm" className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      Start Interview
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Use the Performance Calculator to identify candidates for interviews.</p>
                  <p className="mt-2 text-sm">Professionals scoring between 85-95% will be eligible for interviews.</p>
                  <Button className="mt-6" onClick={() => setActiveTab("calculator")}>
                    Go to Calculator
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-usage">
          <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
            <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-healthcare-primary" />
                AI Usage Monitoring
              </CardTitle>
              <CardDescription>
                Monitor and review professionals with excessive AI usage
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertTitle className="text-blue-800">Usage Monitoring System</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    The system will automatically flag professionals whose AI usage exceeds 90%. 
                    These cases require manual review by management before any action is taken.
                  </AlertDescription>
                </Alert>
                
                {aiUsageExceeded && overallPerformance !== null ? (
                  <Card className="border-amber-200 mt-6">
                    <CardHeader className="pb-2 bg-amber-50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base text-amber-800">High AI Usage Detected</CardTitle>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                          Needs Review
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Professional:</span>
                          <span>{name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Role:</span>
                          <span>{role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">AI Usage:</span>
                          <span className="text-amber-600 font-medium">
                            {metrics.find(m => m.name === "AI Usage")?.score || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Overall Performance:</span>
                          <span>{overallPerformance.toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                      <Button variant="outline" className="border-red-300 text-red-700">
                        <X className="h-4 w-4 mr-1" />
                        Flag for Termination
                      </Button>
                      <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleManualTerminationReview}>
                        <Check className="h-4 w-4 mr-1" />
                        Schedule Review
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No professionals with high AI usage detected.</p>
                    <p className="mt-2 text-sm">Use the Performance Calculator to evaluate professionals.</p>
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

export default EngagementTech;
