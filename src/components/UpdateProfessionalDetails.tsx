
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

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <ProfessionalDetails professional={professional} onEditClick={handleEditClick} />
      <EditProfessionalDialog 
        professional={professional}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdateProfessional}
      />
    </>
  );
};

export default UpdateProfessionalDetails;
