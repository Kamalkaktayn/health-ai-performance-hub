
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
import { Professional } from "@/utils/dataTypes";
import { generateInitialProfessionals } from "@/utils/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [activeProfessional, setActiveProfessional] = useState<Professional | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
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
  };
  
  const handleSelectProfessional = (professional: Professional) => {
    setActiveProfessional(professional);
    setActiveTab('performance');
  };
  
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
            />
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
