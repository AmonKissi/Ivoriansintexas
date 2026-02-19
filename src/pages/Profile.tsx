import { useState, useRef, useEffect } from "react";
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
  Info,
  X,
  Settings2,
  Mail
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";
import defaultProfile from "@/assets/default.png";

const Profile = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [showInfo, setShowInfo] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
  });
  
  const [passwordData, setPasswordData] = useState({ current: "", new: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // FIX: Added () to match dynamic endpoint
        const { data } = await API.get(ENDPOINTS.USERS.PROFILE());
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          city: data.city || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  // --- Handlers ---

  const handleUpdateProfile = async () => {
    try {
      const { data } = await API.put(ENDPOINTS.USERS.PROFILE(), formData);
      setProfile(data);
      setIsEditing(false);
      toast({ title: "Profile Updated", description: "Changes saved successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save changes." });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);
    setIsUploading(true);

    try {
      const response = await API.post(ENDPOINTS.USERS.UPLOAD_PICTURE, data);
      setProfile({ ...profile, profileImage: response.data.profileImage });
      toast({ title: "Success", description: "Profile photo updated!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Upload Failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.current || !passwordData.new) {
      return toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all password fields." });
    }
    try {
      await API.put(ENDPOINTS.USERS.PASSWORD, {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });
      toast({ title: "Security Updated", description: "Password changed successfully." });
      setPasswordData({ current: "", new: "" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Security Error", description: err.response?.data?.message || "Failed to update." });
    }
  };

  const handleDeactivate = async () => {
    if (confirm("Are you sure? Your profile will be hidden from other members.")) {
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
    const confirmation = window.prompt("To delete your account permanently, please type DELETE below:");
    
    if (confirmation === "DELETE") {
      setIsDeleting(true);
      try {
        await API.delete(ENDPOINTS.USERS.PROFILE()); // Deletes the current user
        toast({ title: "Account Deleted", description: "Your data has been permanently removed." });
        logout();
        navigate("/");
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete account. Try again later." });
      } finally {
        setIsDeleting(false);
      }
    } else if (confirmation !== null) {
      toast({ title: "Action Cancelled", description: "Confirmation word was incorrect." });
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <DashboardHeader />

      <main className="flex-grow container mx-auto py-12 px-4 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage your identity and privacy</p>
            </div>
            <TabsList className="bg-card border shadow-sm">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="security">Security & Privacy</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6 mt-0 animate-in fade-in duration-500">
            {showInfo && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3 text-blue-800 text-sm shadow-sm relative">
                <Info size={18} className="mt-0.5 shrink-0" />
                <div className="pr-8">
                  <p className="font-bold">Privacy Note:</p>
                  <p>Only your profile picture, name, and city are visible to other members. Your email and phone are private.</p>
                </div>
                <button onClick={() => setShowInfo(false)} className="absolute top-3 right-3 text-blue-400 hover:text-blue-600">
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Header Card */}
            <Card className="p-8 border-none shadow-sm relative overflow-hidden bg-card">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-card shadow-lg overflow-hidden relative">
                    <img src={profile?.profileImage || defaultProfile} alt="Profile" className="w-full h-full object-cover" />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <Loader2 className="animate-spin mb-1" size={20} />
                        <span className="text-[10px] font-bold">Uploading</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-all z-10">
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <h2 className="text-3xl font-bold text-foreground">{profile?.firstName} {profile?.lastName}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                      Level {profile?.level || 1}
                    </span>
                    <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs border border-border">
                      Joined {joinDate}
                    </span>
                  </div>
                </div>

                <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)} className="gap-2">
                  {isEditing ? "Cancel" : <><Edit2 size={16} /> Edit Profile</>}
                </Button>
              </div>
            </Card>

            {/* Info Form */}
            <Card className="p-8 border-none shadow-sm space-y-8 bg-card">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-6">
                  {/* NON-EDITABLE EMAIL */}
                  <div className="space-y-2 opacity-80">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Account Email (Verified)</label>
                    <div className="p-3 bg-muted/30 rounded-xl border border-dashed flex items-center gap-2 cursor-not-allowed">
                      <Mail size={16} className="text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground italic">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">First Name</label>
                    {isEditing ? (
                      <Input 
                        value={formData.firstName} 
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                        className="h-11 bg-muted/50 focus:bg-background transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                        <p className="text-lg font-medium text-foreground">{profile?.firstName}</p>
                      </div>
                    )}
                  </div>

                  {/* FIXED: ADDED LAST NAME */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Last Name</label>
                    {isEditing ? (
                      <Input 
                        value={formData.lastName} 
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                        className="h-11 bg-muted/50 focus:bg-background transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                        <p className="text-lg font-medium text-foreground">{profile?.lastName}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                    {isEditing ? (
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        className="h-11 bg-muted/50 focus:bg-background transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/50 flex items-center gap-2">
                        <Phone size={16} className="text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground">{profile?.phone || "Not set"}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">City / Location</label>
                    {isEditing ? (
                      <Input 
                        value={formData.city} 
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                        className="h-11 bg-muted/50 focus:bg-background transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/50 flex items-center gap-2">
                        <MapPin size={16} className="text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground">{profile?.city || "Texas"}, TX</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 animate-in slide-in-from-bottom-2 duration-300">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 shadow-lg" 
                    onClick={handleUpdateProfile}
                  >
                    <Save size={18} className="mr-2" /> Save Profile Changes
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-0 animate-in fade-in duration-500">
            <Card className="p-8 border-none shadow-sm bg-card">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Lock size={18} className="text-primary" /> Update Password
              </h3>
              <div className="max-w-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Current Password</label>
                  <Input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">New Password</label>
                  <Input type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} />
                </div>
                <Button onClick={handlePasswordChange} className="w-full md:w-auto px-8">Update Password</Button>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm border-l-4 border-l-destructive bg-destructive/5 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-destructive">
                  <AlertTriangle size={18} /> Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Deactivation hides your data. Deletion permanently removes your profile, posts, and connections.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={handleDeactivate}>
                  <Power size={16} className="mr-2" /> Deactivate Account
                </Button>
                
                <Button variant="destructive" className="font-bold" onClick={handleDeleteAccount} disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="animate-spin mr-2" size={16}/> : <Trash2 size={16} className="mr-2" />}
                  Delete Account Permanently
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