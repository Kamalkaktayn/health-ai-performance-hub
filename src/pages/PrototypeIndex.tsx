import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import LoginForm from "@/components/LoginForm";
import { Professional, User } from "@/utils/dataTypes";
import { generateInitialProfessionals, mockUsers } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  UserCog,
  DollarSign,
  LogOut,
  Menu
} from "lucide-react";
import ProfessionalSuggestions from "@/components/ProfessionalSuggestions";
import ProfessionalDetails from "@/components/ProfessionalDetails";

const PrototypeIndex = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [activeProfessional, setActiveProfessional] = useState<Professional | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = window.innerWidth < 768;
  
  useEffect(() => {
    setProfessionals(generateInitialProfessionals());
    setIsSidebarOpen(!isMobile);
  }, []);
  
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
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleProfessionalUpdate = (updatedProfessional: Professional) => {
    setProfessionals(prevProfessionals =>
      prevProfessionals.map(p => 
        p.email === updatedProfessional.email ? updatedProfessional : p
      )
    );
    
    if (activeProfessional && activeProfessional.email === updatedProfessional.email) {
      setActiveProfessional(updatedProfessional);
    }
  };
  
  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLogin} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-r-indigo-100 transition-all duration-300 overflow-hidden fixed h-full z-40 md:relative`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-8 w-8 rounded-md flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">HealthPerform AI</h2>
          </div>
          
          <div className="space-y-1 mb-6">
            <Button 
              variant={activeTab === 'dashboard' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'professionals' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab('professionals')}
            >
              <Users className="h-4 w-4" />
              Professionals
            </Button>
            <Button 
              variant={activeTab === 'performance' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-2"
              onClick={() => {
                setActiveTab('performance');
                if (professionals.length > 0 && !activeProfessional) {
                  setActiveProfessional(professionals[0]);
                }
              }}
            >
              <UserCog className="h-4 w-4" />
              Performance
            </Button>
            <Button 
              variant={activeTab === 'compensation' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab('compensation')}
            >
              <DollarSign className="h-4 w-4" />
              Compensation
            </Button>
          </div>
          
          <div className="mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
      
      <div className="flex-1 p-6 overflow-auto">
        <div className={`max-w-7xl mx-auto transition-all duration-300 ${isSidebarOpen && !isMobile ? 'ml-0' : 'ml-0'}`}>
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="text-sm text-gray-500">
              Welcome, <span className="font-medium text-indigo-600">{currentUser?.name}</span>
            </div>
          </div>
          
          {activeTab === 'performance' && activeProfessional && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow border-t-4 border-t-indigo-500">
                <h1 className="text-xl font-bold text-gray-800 mb-1">{activeProfessional.name}</h1>
                <p className="text-gray-600">{activeProfessional.role} - {activeProfessional.department}</p>
              </div>
              
              <ProfessionalDetails 
                professional={activeProfessional} 
                onProfessionalUpdate={handleProfessionalUpdate}
              />
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-xl font-bold mb-4">Dashboard Overview</h1>
              <div className="space-y-2">
                <p>Welcome to the HealthPerform AI prototype.</p>
                <p>Click on the "Performance" tab to see the AI-powered suggestions.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'professionals' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-xl font-bold mb-4">Healthcare Professionals</h1>
              <div className="space-y-4">
                {professionals.map((professional, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setActiveProfessional(professional);
                      setActiveTab('performance');
                    }}
                  >
                    <div>
                      <h3 className="font-medium">{professional.name}</h3>
                      <p className="text-sm text-gray-500">{professional.role}</p>
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'compensation' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-xl font-bold mb-4">Compensation Dashboard</h1>
              <p>Compensation data would be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrototypeIndex;
