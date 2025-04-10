import React, { useState, useEffect } from 'react';
import PerformanceNavigation from "@/components/PerformanceNavigation";
import SidebarContent from "@/components/SidebarContent";
import DashboardOverview from "@/components/DashboardOverview";
import ProfessionalsList from "@/components/ProfessionalsList";
import UpdateProfessionalDetails from "@/components/UpdateProfessionalDetails";
import PerformanceMetricsCards from "@/components/PerformanceMetricsCards";
import CompensationTable from "@/components/CompensationTable";
import AIInsights from "@/components/AIInsights";
import AddProfessionalDialog from "@/components/AddProfessionalDialog";
import LoginForm from "@/components/LoginForm";
import EngagementTech from "@/components/EngagementTech";
import ReportsSection from "@/components/ReportsSection";
import ScheduleSection from "@/components/ScheduleSection";
import AdminSettings from "@/components/AdminSettings";
import { Professional, User } from "@/utils/dataTypes";
import { generateInitialProfessionals, mockUsers } from "@/utils/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, X, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Interview {
  id: string;
  professionalName: string;
  email: string;
  dateTime: string;
  originalDate: Date;
  time: string;
  method: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
}

const Index = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [activeProfessional, setActiveProfessional] = useState<Professional | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedInterviews, setSavedInterviews] = useState<Interview[]>([]);
  const [isPostponeDialogOpen, setIsPostponeDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [postponeDate, setPostponeDate] = useState('');
  const [postponeTime, setPostponeTime] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    setProfessionals(generateInitialProfessionals());
  }, []);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (activeTab === 'interviews') {
      const interviewsData = localStorage.getItem('interviews');
      if (interviewsData) {
        try {
          const parsedInterviews = JSON.parse(interviewsData);
          const processedInterviews = parsedInterviews.map((interview: any) => ({
            ...interview,
            originalDate: new Date(interview.originalDate)
          }));
          setSavedInterviews(processedInterviews);
        } catch (error) {
          console.error("Error parsing saved interviews:", error);
        }
      }
    }
  }, [activeTab]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddProfessional = (newProfessional: Professional) => {
    setProfessionals([...professionals, newProfessional]);
    
    toast({
      title: "Professional Added",
      description: "New professional has been added to the system",
      variant: "default"
    });
  };

  const handleUpdateProfessional = (updatedProfessional: Professional) => {
    setProfessionals(
      professionals.map(p => 
        p.id === updatedProfessional.id ? updatedProfessional : p
      )
    );
    
    toast({
      title: "Professional Updated",
      description: `${updatedProfessional.name}'s profile has been updated successfully`,
      variant: "default"
    });
  };

  const handleDeleteProfessional = (id: string) => {
    if (activeProfessional && activeProfessional.id === id) {
      setActiveProfessional(null);
    }
    
    setProfessionals(professionals.filter(prof => prof.id !== id));
    
    toast({
      title: "Professional Deleted",
      description: "The professional has been removed from the system",
      variant: "default"
    });
  };

  const handleSelectProfessional = (professional: Professional) => {
    setActiveProfessional(professional);
    setActiveTab('performance');
  };

  const handleLogin = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      const typedUser: User = {
        ...user,
        role: user.role as "admin" | "manager" | "viewer"
      };
      
      setCurrentUser(typedUser);
      setIsLoggedIn(true);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}`,
        variant: "default"
      });
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    toast({
      title: "User Updated",
      description: `${updatedUser.name}'s profile has been updated successfully`,
      variant: "default"
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
    setActiveProfessional(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
      variant: "default"
    });
  };

  const goToEngagementTech = () => {
    setActiveTab('engagement-tech');
  };

  const handlePostponeInterview = () => {
    if (!selectedInterview) return;
    
    const updatedInterviews = savedInterviews.map(interview => {
      if (interview.id === selectedInterview.id) {
        return {
          ...interview,
          dateTime: `${postponeDate} at ${postponeTime}`,
          originalDate: new Date(`${postponeDate}T${postponeTime}`),
          time: postponeTime,
          status: 'postponed' as const
        };
      }
      return interview;
    });
    
    setSavedInterviews(updatedInterviews);
    localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
    
    setIsPostponeDialogOpen(false);
    setSelectedInterview(null);
    setPostponeDate('');
    setPostponeTime('');
    
    toast({
      title: "Interview Postponed",
      description: "The interview has been rescheduled successfully",
      variant: "default"
    });
  };

  const handleCancelInterview = () => {
    if (!selectedInterview) return;
    
    const updatedInterviews = savedInterviews.map(interview => {
      if (interview.id === selectedInterview.id) {
        return {
          ...interview,
          status: 'cancelled' as const,
          notes: interview.notes 
            ? `${interview.notes}\n\nCancellation Reason: ${cancelReason}` 
            : `Cancellation Reason: ${cancelReason}`
        };
      }
      return interview;
    });
    
    setSavedInterviews(updatedInterviews);
    localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
    
    setIsCancelDialogOpen(false);
    setSelectedInterview(null);
    setCancelReason('');
    
    toast({
      title: "Interview Cancelled",
      description: "The interview has been cancelled",
      variant: "default"
    });
  };

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r transition-all duration-300 overflow-hidden fixed h-full z-40 md:relative`}
      >
        <SidebarContent 
          professionals={professionals}
          activeProfessional={activeProfessional}
          setActiveProfessional={setActiveProfessional}
          onAddProfessional={() => setIsAddDialogOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
      </div>

      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 p-6 overflow-auto">
        <div className={`max-w-7xl mx-auto transition-all duration-300 ${isSidebarOpen && !isMobile ? 'ml-0' : 'ml-0'}`}>
          <PerformanceNavigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            userName={currentUser?.name || ''}
            userRole={currentUser?.role || 'viewer'}
          />

          {activeTab === 'dashboard' && (
            <>
              <DashboardOverview professionals={professionals} />
              <div className="mt-6">
                <AIInsights professionals={professionals} />
              </div>
            </>
          )}

          {activeTab === 'professionals' && (
            <div className="space-y-6">
              <ProfessionalsList 
                professionals={professionals}
                onSelectProfessional={handleSelectProfessional}
                onDeleteProfessional={handleDeleteProfessional}
              />
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-healthcare-primary text-white rounded-md hover:bg-healthcare-accent transition-colors"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Professional
                </button>
              </div>
            </div>
          )}

          {activeTab === 'engagement-tech' && (
            <EngagementTech />
          )}

          {activeTab === 'performance' && (
            <>
              {activeProfessional ? (
                <UpdateProfessionalDetails 
                  professional={activeProfessional} 
                  onUpdateProfessional={handleUpdateProfessional}
                />
              ) : (
                <PerformanceMetricsCards professionals={professionals} />
              )}
            </>
          )}

          {activeTab === 'compensation' && (
            <CompensationTable 
              professionals={professionals}
              onSelectProfessional={handleSelectProfessional}
              onDeleteProfessional={handleDeleteProfessional}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsSection professionals={professionals} />
          )}

          {activeTab === 'schedule' && (
            <ScheduleSection professionals={professionals} />
          )}

          {activeTab === 'interviews' && (
            <div className="space-y-6">
              <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
                <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Video className="h-5 w-5 text-healthcare-primary" />
                        Interview Management
                      </CardTitle>
                      <CardDescription>Schedule and manage interviews with qualified professionals</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {savedInterviews.length > 0 ? (
                    <div className="space-y-4">
                      {savedInterviews.map((interview) => (
                        <Card key={interview.id} className={`mt-4 border-${
                          interview.status === 'scheduled' ? 'blue' : 
                          interview.status === 'completed' ? 'green' : 
                          interview.status === 'cancelled' ? 'red' : 'amber'}-200`}>
                          <CardHeader className={`pb-2 bg-${
                            interview.status === 'scheduled' ? 'blue' : 
                            interview.status === 'completed' ? 'green' : 
                            interview.status === 'cancelled' ? 'red' : 'amber'}-50 flex justify-between items-center`}>
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                {interview.status === 'scheduled' && <Calendar className="h-4 w-4" />}
                                {interview.status === 'postponed' && <Clock className="h-4 w-4" />}
                                {interview.status === 'cancelled' && <X className="h-4 w-4" />}
                                Interview with {interview.professionalName}
                              </CardTitle>
                              <CardDescription>
                                {interview.dateTime} ({interview.method === 'video' ? 'Video Conference' : 
                                  interview.method === 'in-person' ? 'In Person' : 'Phone Call'})
                              </CardDescription>
                            </div>
                            <span className={`px-2 py-1 bg-${
                              interview.status === 'scheduled' ? 'blue' : 
                              interview.status === 'completed' ? 'green' : 
                              interview.status === 'cancelled' ? 'red' : 'amber'}-100 text-${
                              interview.status === 'scheduled' ? 'blue' : 
                              interview.status === 'completed' ? 'green' : 
                              interview.status === 'cancelled' ? 'red' : 'amber'}-800 rounded-full text-xs font-medium capitalize`}>
                              {interview.status}
                            </span>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium mb-1">Professional</p>
                                <p>{interview.professionalName}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1">Email</p>
                                <p>{interview.email}</p>
                              </div>
                              {interview.notes && (
                                <div className="col-span-2">
                                  <p className="text-sm font-medium mb-1">Notes</p>
                                  <p className="text-sm whitespace-pre-line">{interview.notes}</p>
                                </div>
                              )}
                              {['scheduled', 'postponed'].includes(interview.status) && (
                                <div className="col-span-2 mt-4 flex space-x-4">
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => {
                                      setSelectedInterview(interview);
                                      setIsPostponeDialogOpen(true);
                                    }}
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Reschedule
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    className="flex-1"
                                    onClick={() => {
                                      setSelectedInterview(interview);
                                      setIsCancelDialogOpen(true);
                                    }}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No interviews have been scheduled yet.</p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Use the Engagement Tech section to identify and schedule interviews with professionals.
                      </p>
                      <Button onClick={goToEngagementTech} className="mt-6">
                        Go to Engagement Tech
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <AdminSettings currentUser={currentUser} onUpdateUser={handleUpdateUser} />
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
                <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">Notifications</CardTitle>
                      <CardDescription>View and manage your system notifications</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Card className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-red-100 p-2 rounded-full">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">High AI Usage Alert</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Dr. Michael Reynolds has exceeded 90% AI usage and requires review.
                            </p>
                            <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Calendar className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Upcoming Performance Review</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Scheduled performance review with Dr. Sarah Chen tomorrow at 2:00 PM.
                            </p>
                            <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Video className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Interview Scheduled</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              New interview has been scheduled with Dr. James Wilson.
                            </p>
                            <p className="text-xs text-gray-500 mt-2">3 days ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <AddProfessionalDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddProfessional={handleAddProfessional}
      />

      <Dialog open={isPostponeDialogOpen} onOpenChange={setIsPostponeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <DialogDescription>
              Select a new date and time for this interview.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                New Date
              </label>
              <input
                type="date"
                value={postponeDate}
                onChange={(e) => setPostponeDate(e.target.value)}
                className="col-span-3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                New Time
              </label>
              <input
                type="time"
                value={postponeTime}
                onChange={(e) => setPostponeTime(e.target.value)}
                className="col-span-3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPostponeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePostponeInterview}
              disabled={!postponeDate || !postponeTime}
            >
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this interview? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Reason
              </label>
              <Textarea 
                placeholder="Please provide a reason for cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Go Back
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancelInterview}
              disabled={!cancelReason}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
