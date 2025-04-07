
import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PerformanceNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  userName?: string;
  userRole?: string;
}

const PerformanceNavigation: React.FC<PerformanceNavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  isSidebarOpen, 
  toggleSidebar,
  userName = "",
  userRole = ""
}) => {
  const getButtonVariant = (tab: string) => {
    return activeTab === tab ? "default" : "ghost";
  };
  
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-2">
            <NavigationMenuItem>
              <Button 
                variant={getButtonVariant("dashboard")} 
                className={cn("text-sm", activeTab === "dashboard" && "bg-healthcare-primary")}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button 
                variant={getButtonVariant("professionals")} 
                className={cn("text-sm", activeTab === "professionals" && "bg-healthcare-primary")}
                onClick={() => setActiveTab("professionals")}
              >
                Professionals
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button 
                variant={getButtonVariant("performance")} 
                className={cn("text-sm", activeTab === "performance" && "bg-healthcare-primary")}
                onClick={() => setActiveTab("performance")}
              >
                Performance
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button 
                variant={getButtonVariant("compensation")} 
                className={cn("text-sm", activeTab === "compensation" && "bg-healthcare-primary")}
                onClick={() => setActiveTab("compensation")}
              >
                Compensation
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      {/* User Information */}
      {userName && (
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
          </div>
          <Avatar className="h-8 w-8 bg-healthcare-primary text-white">
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default PerformanceNavigation;
