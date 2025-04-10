
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Lock, 
  User, 
  Mail, 
  Edit, 
  Save, 
  ShieldAlert,
  UserCog,
  FileText,
  Plus,
  Building
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User as UserType } from "@/utils/dataTypes";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface AdminSettingsProps {
  currentUser: UserType | null;
  onUpdateUser: (updatedUser: UserType) => void;
}

type AdditionalInfo = {
  title?: string;
  department?: string;
  location?: string;
  bio?: string;
  joinDate?: string;
  employeeId?: string;
};

const AdminSettings: React.FC<AdminSettingsProps> = ({ currentUser, onUpdateUser }) => {
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingAdditionalInfo, setIsEditingAdditionalInfo] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    title: '',
    department: '',
    location: '',
    bio: '',
    joinDate: '',
    employeeId: ''
  });
  
  const form = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
    }
  });

  React.useEffect(() => {
    if (currentUser) {
      setEditedUser({...currentUser});
      form.reset({
        name: currentUser.name,
        email: currentUser.email
      });
      
      // Initialize additional info if it exists in the user object
      if (currentUser.additionalInfo) {
        setAdditionalInfo(currentUser.additionalInfo);
      }
    }
  }, [currentUser, form]);

  if (!currentUser || !editedUser) return null;

  const handleSaveProfile = () => {
    if (editedUser) {
      onUpdateUser(editedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        variant: "default"
      });
      
      setIsEditingProfile(false);
    }
  };

  const handleChangePassword = () => {
    // Validate current password
    if (currentPassword !== currentUser.password) {
      toast({
        title: "Error",
        description: "Current password is incorrect",
        variant: "destructive"
      });
      return;
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    // Validate password match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    // Update password
    const updatedUser = {
      ...currentUser,
      password: newPassword
    };
    
    onUpdateUser(updatedUser);
    
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully",
      variant: "default"
    });
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingPassword(false);
  };

  const handleSaveAdditionalInfo = () => {
    const updatedUser = {
      ...currentUser,
      additionalInfo: additionalInfo
    };
    
    onUpdateUser(updatedUser);
    
    toast({
      title: "Additional Information Updated",
      description: "Your additional information has been updated successfully",
      variant: "default"
    });
    
    setIsEditingAdditionalInfo(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
        <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Settings className="h-5 w-5 text-healthcare-primary" />
                Admin Settings
              </CardTitle>
              <CardDescription>Manage your account settings and system preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Account Information */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-healthcare-primary" />
                  Account Information
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Role</p>
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100 capitalize">
                            {editedUser.role}
                          </Badge>
                          {editedUser.role === 'admin' && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <ShieldAlert className="h-3 w-3 mr-1 text-blue-500" />
                              Full system access
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <UserCog className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Name</p>
                      {isEditingProfile ? (
                        <Input 
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                          className="max-w-md"
                        />
                      ) : (
                        <p>{editedUser.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      {isEditingProfile ? (
                        <Input 
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                          className="max-w-md"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          {editedUser.email}
                        </div>
                      )}
                    </div>
                    
                    {isEditingProfile && (
                      <div className="flex justify-end">
                        <Button onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Additional Information */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Plus className="h-5 w-5 text-healthcare-primary" />
                  Additional Information
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditingAdditionalInfo(!isEditingAdditionalInfo)}
                >
                  {isEditingAdditionalInfo ? (
                    <>Cancel</>
                  ) : (
                    <>Edit Information</>
                  )}
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {isEditingAdditionalInfo ? (
                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Job Title
                          </label>
                          <Input 
                            value={additionalInfo.title || ''}
                            onChange={(e) => setAdditionalInfo({...additionalInfo, title: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Department
                          </label>
                          <Select 
                            value={additionalInfo.department || ''}
                            onValueChange={(value) => setAdditionalInfo({...additionalInfo, department: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IT">Information Technology</SelectItem>
                              <SelectItem value="HR">Human Resources</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Location
                          </label>
                          <Input 
                            value={additionalInfo.location || ''}
                            onChange={(e) => setAdditionalInfo({...additionalInfo, location: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Employee ID
                          </label>
                          <Input 
                            value={additionalInfo.employeeId || ''}
                            onChange={(e) => setAdditionalInfo({...additionalInfo, employeeId: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Join Date
                          </label>
                          <Input 
                            type="date"
                            value={additionalInfo.joinDate || ''}
                            onChange={(e) => setAdditionalInfo({...additionalInfo, joinDate: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Bio
                        </label>
                        <Textarea 
                          value={additionalInfo.bio || ''}
                          onChange={(e) => setAdditionalInfo({...additionalInfo, bio: e.target.value})}
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={handleSaveAdditionalInfo}>
                          Save Additional Information
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!additionalInfo.title && 
                       !additionalInfo.department && 
                       !additionalInfo.location && 
                       !additionalInfo.bio && 
                       !additionalInfo.joinDate && 
                       !additionalInfo.employeeId ? (
                        <div className="text-center py-6">
                          <Building className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">No additional information provided</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Click the Edit Information button to add details about your role and responsibilities.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {additionalInfo.title && (
                            <div>
                              <p className="text-sm font-medium mb-1">Job Title</p>
                              <p>{additionalInfo.title}</p>
                            </div>
                          )}
                          
                          {additionalInfo.department && (
                            <div>
                              <p className="text-sm font-medium mb-1">Department</p>
                              <p>{additionalInfo.department}</p>
                            </div>
                          )}
                          
                          {additionalInfo.location && (
                            <div>
                              <p className="text-sm font-medium mb-1">Location</p>
                              <p>{additionalInfo.location}</p>
                            </div>
                          )}
                          
                          {additionalInfo.employeeId && (
                            <div>
                              <p className="text-sm font-medium mb-1">Employee ID</p>
                              <p>{additionalInfo.employeeId}</p>
                            </div>
                          )}
                          
                          {additionalInfo.joinDate && (
                            <div>
                              <p className="text-sm font-medium mb-1">Join Date</p>
                              <p>{formatDate(additionalInfo.joinDate)}</p>
                            </div>
                          )}
                          
                          {additionalInfo.bio && (
                            <div className="col-span-2">
                              <p className="text-sm font-medium mb-1">Bio</p>
                              <p className="text-gray-700">{additionalInfo.bio}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Security Settings */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Lock className="h-5 w-5 text-healthcare-primary" />
                  Security Settings
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditingPassword(!isEditingPassword)}
                >
                  {isEditingPassword ? (
                    <>Cancel</>
                  ) : (
                    <>Change Password</>
                  )}
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {isEditingPassword ? (
                    <div className="space-y-4 max-w-md mx-auto">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Current Password
                        </label>
                        <Input 
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          New Password
                        </label>
                        <Input 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Confirm New Password
                        </label>
                        <Input 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleChangePassword}>
                          Update Password
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Lock className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Password last changed: Never</p>
                      <p className="text-xs text-gray-400 mt-1">
                        For security reasons, we recommend changing your password regularly.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
