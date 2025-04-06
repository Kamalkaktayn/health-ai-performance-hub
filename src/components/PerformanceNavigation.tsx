
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  UserCog, 
  Users, 
  DollarSign, 
  BellRing, 
  Search,
  Menu
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PerformanceNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const PerformanceNavigation: React.FC<PerformanceNavigationProps> = ({ 
  activeTab, 
  setActiveTab,
  isSidebarOpen,
  toggleSidebar
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 w-full">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {isMobile && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-healthcare-dark">Healthcare Performance Hub</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search professionals..."
            className="pl-8 h-9 w-full sm:w-[200px] lg:w-[300px] rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon">
            <BellRing className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-healthcare-primary font-medium">
            <UserCog className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} className="w-full sm:w-auto mt-4 sm:mt-0" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="dashboard" className="flex gap-1 items-center">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="professionals" className="flex gap-1 items-center">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Professionals</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex gap-1 items-center">
            <UserCog className="h-4 w-4" />
            <span className="hidden md:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="compensation" className="flex gap-1 items-center">
            <DollarSign className="h-4 w-4" />
            <span className="hidden md:inline">Compensation</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default PerformanceNavigation;
