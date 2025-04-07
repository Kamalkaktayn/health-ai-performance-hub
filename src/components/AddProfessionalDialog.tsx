
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateProfessional } from "@/utils/mockData";
import { Professional, Role } from "@/utils/dataTypes";
import { useToast } from "@/components/ui/use-toast";

interface AddProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProfessional: (professional: Professional) => void;
}

const AddProfessionalDialog: React.FC<AddProfessionalDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddProfessional
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !role || !department || !salary) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    const salaryCleaned = parseInt(salary.replace(/,/g, ''));
    
    if (isNaN(salaryCleaned)) {
      toast({
        title: "Error",
        description: "Please enter a valid salary amount",
        variant: "destructive"
      });
      return;
    }
    
    // Pass only 3 arguments as expected by generateProfessional
    const newProfessional = generateProfessional(name, role as Role, department);
    
    // Update the salary after generation if needed
    if (salaryCleaned) {
      newProfessional.salary = salaryCleaned;
      // Recalculate bonus based on the new salary
      const tier = newProfessional.performance / 100;
      newProfessional.bonus = salaryCleaned * tier;
    }
    
    onAddProfessional(newProfessional);
    
    // Reset form
    setName('');
    setRole('');
    setDepartment('');
    setSalary('');
    
    // Close dialog
    onOpenChange(false);
    
    toast({
      title: "Professional Added",
      description: "The new professional has been added to the system"
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Healthcare Professional</DialogTitle>
            <DialogDescription>
              Add a new healthcare professional to the performance management system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Dr. Jane Smith"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger id="role" className="col-span-3">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="col-span-3"
                placeholder="Cardiology"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Base Salary
              </Label>
              <Input
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="col-span-3"
                placeholder="120,000"
                type="text"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Professional</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProfessionalDialog;
