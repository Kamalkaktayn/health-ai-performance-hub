
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Users, 
  Settings, 
  FileText, 
  PieChart, 
  CalendarDays,
  UserCog,
  DollarSign,
  LogOut,
  PlusCircle,
  Activity,
  Video,
  Mail,
  Bell
} from "lucide-react";
import { Professional } from "@/utils/dataTypes";

interface SidebarContentProps {
  professionals: Professional[];
  activeProfessional: Professional | null;
  setActiveProfessional: (professional: Professional | null) => void;
  onAddProfessional: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ 
  professionals, 
  activeProfessional,
  setActiveProfessional,
  onAddProfessional,
  activeTab,
  setActiveTab,
  onLogout
}) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setActiveProfessional(null);
  };
  
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-healthcare-primary h-8 w-8 rounded-md flex items-center justify-center">
          <PieChart className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-bold">HealthPerform AI</h2>
      </div>
      
      <div className="space-y-1 mb-6">
        <Button 
          variant={activeTab === 'dashboard' ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('dashboard')}
        >
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </Button>
        <Button 
          variant={activeTab === 'professionals' ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('professionals')}
        >
          <Users className="h-4 w-4" />
          Professionals
        </Button>
        <Button 
          variant={activeTab === 'engagement-tech' ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('engagement-tech')}
        >
          <Activity className="h-4 w-4" />
          Engagement Tech
        </Button>
        <Button 
          variant={activeTab === 'performance' ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('performance')}
        >
          <UserCog className="h-4 w-4" />
          Performance
        </Button>
        <Button 
          variant={activeTab === 'compensation' ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('compensation')}
        >
          <DollarSign className="h-4 w-4" />
          Compensation
        </Button>
        <Button 
          variant={activeTab === 'reports' ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('reports')}
        >
          <FileText className="h-4 w-4" />
          Reports
        </Button>
        <Button 
          variant={activeTab === 'schedule' ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('schedule')}
        >
          <CalendarDays className="h-4 w-4" />
          Schedule
        </Button>
        <Button 
          variant={activeTab === 'interviews' ? "secondary" : "ghost"} 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('interviews')}
        >
          <Video className="h-4 w-4" />
          Interviews
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Professionals</h3>
        <Button variant="ghost" size="sm" onClick={onAddProfessional}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-1 mb-4 flex-1 overflow-auto">
        {professionals.map((professional) => (
          <Button 
            key={professional.id}
            variant={activeProfessional?.id === professional.id ? "secondary" : "ghost"}
            className="w-full justify-start text-left"
            onClick={() => {
              setActiveProfessional(professional);
              setActiveTab('performance');
            }}
          >
            <div className="truncate">
              <div className="font-medium">{professional.name}</div>
              <div className="text-xs text-muted-foreground">{professional.role}</div>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-auto">
        <Separator className="my-4" />
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2"
          onClick={() => handleTabClick('settings')}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-red-500"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SidebarContent;
