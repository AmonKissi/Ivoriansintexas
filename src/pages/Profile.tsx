// src/pages/Profile.tsx

import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Shield,
  Calendar,
  Camera,
  Loader2,
  Save,
  Edit2,
  Lock,
  Trash2,
  Power,
  AlertTriangle,
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    city: user?.city || "",
  });
  const [passwordData, setPasswordData] = useState({ current: "", new: "" });

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  // --- Handlers ---

  const handleUpdateProfile = async () => {
    try {
      const { data } = await API.put(ENDPOINTS.USERS.PROFILE, formData);
      setUser(data);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your information has been saved.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update info.",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("image", file);
    setIsUploading(true);
    try {
      const response = await API.post(ENDPOINTS.USERS.UPLOAD_PICTURE, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser({ ...user, profileImage: response.data.profileImage });
      toast({ title: "Success", description: "Profile picture updated!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Upload Failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.current || !passwordData.new) {
      return toast({
        title: "Missing fields",
        description: "Please fill in both password fields.",
      });
    }
    try {
      await API.put(ENDPOINTS.USERS.PASSWORD, {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });
      toast({
        title: "Password Updated",
        description: "Your new password is set.",
      });
      setPasswordData({ current: "", new: "" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Password change failed.",
      });
    }
  };

  const handleDeactivate = async () => {
    if (
      confirm(
        "Are you sure you want to deactivate? You won't be visible to others.",
      )
    ) {
      try {
        await API.patch(ENDPOINTS.USERS.DEACTIVATE);
        logout();
        navigate("/");
      } catch (err) {
        toast({ variant: "destructive", title: "Action Failed" });
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "🚨 PERMANENT DELETE: This cannot be undone. All data will be wiped. Proceed?",
      )
    ) {
      try {
        await API.delete(ENDPOINTS.USERS.PROFILE);
        logout();
        navigate("/");
      } catch (err) {
        toast({ variant: "destructive", title: "Action Failed" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <DashboardHeader />

      <main className="flex-grow container mx-auto py-12 px-4 max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
            <TabsList className="bg-card border">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security & Privacy</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6 mt-0">
            {/* Header Card */}
            <Card className="p-8 border-none shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-green-600" />
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-card shadow-lg overflow-hidden">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-muted-foreground" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <h2 className="text-3xl font-bold">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Shield size={14} /> Level {user?.level}
                    </span>
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <Calendar size={14} /> Joined {joinDate}
                    </span>
                  </div>
                </div>

                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  {isEditing ? (
                    "Cancel"
                  ) : (
                    <>
                      <Edit2 size={16} /> Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Info Form */}
            <Card className="p-8 border-none shadow-sm space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    First Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-lg font-medium">{user?.firstName}</p>
                  )}

                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Last Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-lg font-medium">{user?.lastName}</p>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-lg font-medium">{user?.phone || "—"}</p>
                  )}

                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    City
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-lg font-medium">{user?.city}, TX</p>
                  )}
                </div>
              </div>
              {isEditing && (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleUpdateProfile}
                >
                  <Save size={18} className="mr-2" /> Save Changes
                </Button>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-0">
            <Card className="p-8 border-none shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Lock size={18} className="text-primary" /> Change Password
              </h3>
              <div className="max-w-sm space-y-4">
                /* --- Corrected Security Section --- */
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold">
                    CURRENT PASSWORD
                  </label>
                  <Input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value,
                      })
                    } // Fixed here
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold">
                    NEW PASSWORD
                  </label>
                  <Input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, new: e.target.value })
                    } // Fixed here
                  />
                </div>
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm border-l-4 border-l-destructive bg-destructive/5">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-destructive">
                <AlertTriangle size={18} /> Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                These actions are sensitive. Permanent deletion will remove all
                your community posts and connections.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  onClick={handleDeactivate}
                >
                  <Power size={16} className="mr-2" /> Deactivate
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 size={16} className="mr-2" /> Delete Permanently
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
