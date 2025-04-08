
import React, { useState, useEffect } from 'react';
import PerformanceNavigation from "@/components/PerformanceNavigation";
import SidebarContent from "@/components/SidebarContent";
import DashboardOverview from "@/components/DashboardOverview";
import ProfessionalsList from "@/components/ProfessionalsList";
import ProfessionalDetails from "@/components/ProfessionalDetails";
import PerformanceMetricsCards from "@/components/PerformanceMetricsCards";
import CompensationTable from "@/components/CompensationTable";
import AIInsights from "@/components/AIInsights";
import AddProfessionalDialog from "@/components/AddProfessionalDialog";
import LoginForm from "@/components/LoginForm";
import EngagementTech from "@/components/EngagementTech";
import { Professional, User } from "@/utils/dataTypes";
import { generateInitialProfessionals, mockUsers } from "@/utils/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";

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
  
  useEffect(() => {
    // Generate initial data
    setProfessionals(generateInitialProfessionals());
  }, []);
  
  useEffect(() => {
    // Update sidebar visibility based on mobile state
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
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
  
  const handleDeleteProfessional = (id: string) => {
    // If the professional being deleted is the active one, set activeProfessional to null
    if (activeProfessional && activeProfessional.id === id) {
      setActiveProfessional(null);
    }
    
    // Filter out the professional with the given id
    setProfessionals(professionals.filter(prof => prof.id !== id));
    
    // Show toast notification
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
      // Ensure we're properly casting the role to satisfy TypeScript
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
  
  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLogin} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
      
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main content */}
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
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <DashboardOverview professionals={professionals} />
              <div className="mt-6">
                <AIInsights professionals={professionals} />
              </div>
            </>
          )}
          
          {/* Professionals Tab */}
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
          
          {/* Engagement Tech Tab */}
          {activeTab === 'engagement-tech' && (
            <EngagementTech />
          )}
          
          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <>
              {activeProfessional ? (
                <ProfessionalDetails professional={activeProfessional} />
              ) : (
                <PerformanceMetricsCards professionals={professionals} />
              )}
            </>
          )}
          
          {/* Compensation Tab */}
          {activeTab === 'compensation' && (
            <CompensationTable 
              professionals={professionals}
              onSelectProfessional={handleSelectProfessional}
              onDeleteProfessional={handleDeleteProfessional}
            />
          )}
          
          {/* Interviews Tab */}
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
                  <div className="text-center py-8">
                    <p className="text-gray-500">Use the Engagement Tech section to identify and schedule interviews with professionals.</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Professionals scoring between 85-95% in their performance evaluation will be eligible for interviews.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
                <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">Account Settings</CardTitle>
                      <CardDescription>Manage your account settings and preferences</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">Name</span>
                      <span>{currentUser?.name}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">Email</span>
                      <span>{currentUser?.email}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">Role</span>
                      <span className="capitalize">{currentUser?.role}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
                <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">Reports</CardTitle>
                      <CardDescription>View and generate performance reports</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-8 text-gray-500">
                    <p>Reports functionality is under development</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
                <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">Schedule</CardTitle>
                      <CardDescription>View and manage performance review schedules</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-8 text-gray-500">
                    <p>Schedule functionality is under development</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Professional Dialog */}
      <AddProfessionalDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddProfessional={handleAddProfessional}
      />
    </div>
  );
};

export default Index;
