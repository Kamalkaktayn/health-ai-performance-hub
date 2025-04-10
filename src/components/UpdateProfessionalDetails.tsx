
import React, { useState } from 'react';
import ProfessionalDetails from './ProfessionalDetails';
import EditProfessionalDialog from './EditProfessionalDialog';
import { Professional } from "@/utils/dataTypes";

interface UpdateProfessionalDetailsProps {
  professional: Professional;
  onUpdateProfessional: (updatedProfessional: Professional) => void;
}

const UpdateProfessionalDetails: React.FC<UpdateProfessionalDetailsProps> = ({ 
  professional,
  onUpdateProfessional
}) => {
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

  return (
    <>
      <ProfessionalDetails professional={currentProfessional} onEditClick={handleEditClick} />
      <EditProfessionalDialog 
        professional={currentProfessional}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdateProfessional}
      />
    </>
  );
};

export default UpdateProfessionalDetails;
