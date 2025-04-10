
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Professional, Metric, Skill } from "@/utils/dataTypes";
import { useToast } from "@/hooks/use-toast";

interface EditProfessionalDialogProps {
  professional: Professional | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedProfessional: Professional) => void;
}

const EditProfessionalDialog: React.FC<EditProfessionalDialogProps> = ({
  professional,
  open,
  onOpenChange,
  onUpdate
}) => {
  const { toast } = useToast();
  const [editedProfessional, setEditedProfessional] = useState<Professional | null>(null);

  // Initialize form with professional data when opened
  React.useEffect(() => {
    if (professional && open) {
      setEditedProfessional({...professional});
    }
  }, [professional, open]);

  if (!editedProfessional) return null;

  const handleMetricChange = (index: number, value: number) => {
    const updatedMetrics = [...editedProfessional.metrics];
    updatedMetrics[index] = {
      ...updatedMetrics[index],
      score: value
    };
    setEditedProfessional({
      ...editedProfessional,
      metrics: updatedMetrics
    });
  };

  const handleSkillChange = (index: number, value: number) => {
    const updatedSkills = [...editedProfessional.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      level: value
    };
    setEditedProfessional({
      ...editedProfessional,
      skills: updatedSkills
    });
  };

  const calculateNewPerformance = (metrics: Metric[]): number => {
    const totalWeight = metrics.reduce((sum, metric) => sum + metric.weight, 0);
    const weightedScore = metrics.reduce((sum, metric) => sum + (metric.score * metric.weight), 0);
    
    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  };

  const handleSave = () => {
    // Calculate new overall performance score
    const newPerformance = calculateNewPerformance(editedProfessional.metrics);
    
    // Update the professional with new performance score
    const updatedProfessional = {
      ...editedProfessional,
      performance: newPerformance
    };
    
    onUpdate(updatedProfessional);
    onOpenChange(false);
    
    toast({
      title: "Professional Updated",
      description: `${updatedProfessional.name}'s profile has been updated successfully`,
      variant: "default"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Professional</DialogTitle>
          <DialogDescription>
            Make changes to {editedProfessional.name}'s profile information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Name
              </label>
              <Input 
                value={editedProfessional.name}
                onChange={(e) => setEditedProfessional({
                  ...editedProfessional,
                  name: e.target.value
                })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Role
              </label>
              <Select 
                value={editedProfessional.role}
                onValueChange={(value: any) => setEditedProfessional({
                  ...editedProfessional,
                  role: value
                })}
              >
                <SelectTrigger>
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
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Department
              </label>
              <Input 
                value={editedProfessional.department}
                onChange={(e) => setEditedProfessional({
                  ...editedProfessional,
                  department: e.target.value
                })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email
              </label>
              <Input 
                value={editedProfessional.email}
                onChange={(e) => setEditedProfessional({
                  ...editedProfessional,
                  email: e.target.value
                })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Phone
              </label>
              <Input 
                value={editedProfessional.phone || ''}
                onChange={(e) => setEditedProfessional({
                  ...editedProfessional,
                  phone: e.target.value
                })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Salary
              </label>
              <Input 
                type="number"
                value={editedProfessional.salary}
                onChange={(e) => setEditedProfessional({
                  ...editedProfessional,
                  salary: Number(e.target.value)
                })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Bonus
              </label>
              <Input 
                type="number"
                value={editedProfessional.bonus}
                onChange={(e) => setEditedProfessional({
                  ...editedProfessional,
                  bonus: Number(e.target.value)
                })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                AI Usage %
              </label>
              <Slider 
                value={[editedProfessional.aiUsage]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(value) => setEditedProfessional({
                  ...editedProfessional,
                  aiUsage: value[0]
                })}
              />
              <div className="text-center mt-2">{editedProfessional.aiUsage}%</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-3">Performance Metrics</h3>
              <div className="space-y-6">
                {editedProfessional.metrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium">
                        {metric.name} <span className="text-gray-500 text-xs">(Weight: {metric.weight}%)</span>
                      </label>
                      <span className="font-bold">{metric.score}%</span>
                    </div>
                    <Slider 
                      value={[metric.score]} 
                      min={0} 
                      max={100} 
                      step={1}
                      onValueChange={(value) => handleMetricChange(index, value[0])}
                    />
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3">Skills</h3>
              <div className="space-y-4">
                {editedProfessional.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium">{skill.name}</label>
                      <span className="font-bold">{skill.level}%</span>
                    </div>
                    <Slider 
                      value={[skill.level]} 
                      min={0} 
                      max={100} 
                      step={1}
                      onValueChange={(value) => handleSkillChange(index, value[0])}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfessionalDialog;
