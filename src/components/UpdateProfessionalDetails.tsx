
import React, { useState } from 'react';
import ProfessionalDetails from './ProfessionalDetails';
import EditProfessionalDialog from './EditProfessionalDialog';
import ProfessionalManagement from './ProfessionalManagement';
import { Professional } from "@/utils/dataTypes";
import { useToast } from "@/hooks/use-toast";

interface UpdateProfessionalDetailsProps {
  professional: Professional;
  onUpdateProfessional: (updatedProfessional: Professional) => void;
}

const UpdateProfessionalDetails: React.FC<UpdateProfessionalDetailsProps> = ({ 
  professional,
  onUpdateProfessional
}) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<Professional>(professional);

  // Update local state when professional prop changes
  React.useEffect(() => {
    setCurrentProfessional(professional);
  }, [professional]);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfessional = (updatedProfessional: Professional) => {
    setCurrentProfessional(updatedProfessional);
    onUpdateProfessional(updatedProfessional);
  };

  const handleFireProfessional = (id: string) => {
    // In a real app, this would call an API to remove the professional
    console.log(`Professional ${id} has been removed from the system`);
    
    // Notify parent component
    const updatedProfessional = {
      ...currentProfessional,
      status: 'inactive'
    };
    
    setCurrentProfessional(updatedProfessional);
    onUpdateProfessional(updatedProfessional);
  };

  const handleSendFeedback = (id: string, feedback: string) => {
    // In a real app, this would send feedback to the professional
    console.log(`Feedback sent to professional ${id}: ${feedback}`);
    
    toast({
      title: "Feedback Sent",
      description: `Feedback has been sent to ${currentProfessional.name}`,
      variant: "default"
    });
  };

  return (
    <>
      <ProfessionalDetails professional={currentProfessional} onEditClick={handleEditClick} />
      <EditProfessionalDialog 
        professional={currentProfessional}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdateProfessional}
      />
      <ProfessionalManagement
        professional={currentProfessional}
        onFireProfessional={handleFireProfessional}
        onSendFeedback={handleSendFeedback}
      />
    </>
  );
};

export default UpdateProfessionalDetails;
