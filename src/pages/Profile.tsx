// src/pages/Profile.tsx

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom"; // Add this import
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
  Mail,
  Check, // Add this
  UserPlus, // Add this
  ExternalLink, // Usually good to have for profiles
} from "lucide-react";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";
import defaultProfile from "@/assets/default.png";

const Profile = () => {
  const { identifier } = useParams(); // Get the ID or Username from URL
  const { logout, user: authUser } = useAuth(); // Get logged in user
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
      setLoading(true);
      try {
        // If identifier exists, fetch that user. If not, fetch 'me'
        const target = identifier || "";
        const { data } = await API.get(ENDPOINTS.USERS.PROFILE(target));

        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          city: data.city || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        toast({ variant: "destructive", title: "User not found" });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [identifier]); // Re-run when the URL changes

  // Helper to check if this is the logged-in user's own page
  const isOwnProfile = profile?.isOwnProfile;

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
      toast({
        title: "Profile Updated",
        description: "Changes saved successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save changes.",
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
      return toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all password fields.",
      });
    }
    try {
      await API.put(ENDPOINTS.USERS.PASSWORD, {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });
      toast({
        title: "Security Updated",
        description: "Password changed successfully.",
      });
      setPasswordData({ current: "", new: "" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Security Error",
        description: err.response?.data?.message || "Failed to update.",
      });
    }
  };

  const handleDeactivate = async () => {
    if (
      confirm("Are you sure? Your profile will be hidden from other members.")
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
    const confirmation = window.prompt(
      "To delete your account permanently, please type DELETE below:",
    );

    if (confirmation === "DELETE") {
      setIsDeleting(true);
      try {
        await API.delete(ENDPOINTS.USERS.PROFILE()); // Deletes the current user
        toast({
          title: "Account Deleted",
          description: "Your data has been permanently removed.",
        });
        logout();
        navigate("/");
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not delete account. Try again later.",
        });
      } finally {
        setIsDeleting(false);
      }
    } else if (confirmation !== null) {
      toast({
        title: "Action Cancelled",
        description: "Confirmation word was incorrect.",
      });
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  const handleSendRequest = async (targetId: string) => {
    try {
      await API.post(ENDPOINTS.USERS.REQUEST(targetId));
      toast({ title: "Request Sent", description: "Waiting for approval." });
      // Update local state so button changes immediately
      setProfile({ ...profile, connectionStatus: "pending_sent" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send request.",
      });
    }
  };

  const handleAcceptRequest = async (targetId: string) => {
    try {
      await API.post(ENDPOINTS.USERS.ACCEPT(targetId));
      toast({ title: "Akwaba!", description: "You are now connected." });
      setProfile({ ...profile, connectionStatus: "connected" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not accept request.",
      });
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <DashboardHeader />

      <main className="flex-grow container mx-auto py-12 px-4 max-w-4xl">
        {/* VISIT NOTICE BANNER */}
        {!isOwnProfile && (
          <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <User size={20} className="text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    You are viewing {profile?.firstName}'s public profile
                  </p>
                  <p className="text-xs text-amber-700/80">
                    Some sensitive information is hidden for privacy.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
                className="border-amber-300 text-amber-800 hover:bg-amber-100 hover:text-amber-900 gap-2 shrink-0"
              >
                <User size={14} />
                Return to my profile
              </Button>
            </div>
          </div>
        )}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Account Settings
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your identity and privacy
              </p>
            </div>
            <TabsList className="bg-card border shadow-sm">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="security">Security & Privacy</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="profile"
            className="space-y-6 mt-0 animate-in fade-in duration-500"
          >
            {showInfo && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3 text-blue-800 text-sm shadow-sm relative">
                <Info size={18} className="mt-0.5 shrink-0" />
                <div className="pr-8">
                  <p className="font-bold">Privacy Note:</p>
                  <p>
                    Only your profile picture, name, and city are visible to
                    other members. Your email and phone are private.
                  </p>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="absolute top-3 right-3 text-blue-400 hover:text-blue-600"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Header Card */}
            <Card className="p-8 border-none shadow-sm relative overflow-hidden bg-card">
              {/* The Ivorian Flag Gradient Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />

              {/* Professional Badge for Public View */}
              {!profile?.isOwnProfile && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 animate-in fade-in zoom-in duration-300">
                  <Shield size={12} className="fill-emerald-700/20" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    AIT Verified Member
                  </span>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Image Section */}
                <div className="relative group">
                  <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-lg overflow-hidden relative transition-all duration-300 ${
                      profile?.isOwnProfile
                        ? "border-card hover:border-primary/20"
                        : "border-emerald-500/20"
                    }`}
                  >
                    <img
                      src={profile?.profileImage || defaultProfile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <Loader2 className="animate-spin mb-1" size={20} />
                        <span className="text-[10px] font-bold">Uploading</span>
                      </div>
                    )}
                  </div>

                  {/* Only show camera button if it's YOUR profile */}
                  {profile?.isOwnProfile && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 hover:scale-110 transition-all z-10"
                        title="Update Photo"
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
                    </>
                  )}
                </div>

                {/* Name and Stats Section */}
                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                      {profile?.firstName} {profile?.lastName}
                      {/* Level 4, 5, 6 Verified Admin Badge */}
                      {profile?.level >= 4 && (
                        <div className="flex items-center group relative">
                          <Check
                            size={20}
                            className="text-white bg-blue-500 rounded-full p-1 shadow-sm border-2 border-background"
                          />
                          {/* Optional: Hover label to show they are an Official */}
                          <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-[8px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-black uppercase tracking-tighter">
                            Official Representative
                          </span>
                        </div>
                      )}
                      {/* Standard User Verification (if you have a separate boolean) */}
                      {profile?.isVerified && profile?.level < 4 && (
                        <Check
                          size={20}
                          className="text-blue-500 bg-blue-50 rounded-full p-0.5"
                        />
                      )}
                    </h2>
                    {!profile?.isOwnProfile && profile?.username && (
                      <p className="text-sm font-medium text-primary">
                        @{profile.username}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                      {profile?.roleLabel || `Level ${profile?.level || 1}`}
                    </span>
                    <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs border border-border flex items-center gap-1">
                      <Calendar size={12} /> Joined {joinDate}
                    </span>
                  </div>
                </div>

                {/* Dynamic Action Button Section */}
                <div className="flex gap-2">
                  {profile?.isOwnProfile ? (
                    // --- VIEWING OWN PROFILE: SHOW EDIT ---
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="gap-2 font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      {isEditing ? (
                        "Cancel"
                      ) : (
                        <>
                          <Edit2 size={16} /> Edit Profile
                        </>
                      )}
                    </Button>
                  ) : (
                    // --- VIEWING PUBLIC PROFILE: SHOW SOCIAL ---
                    <div className="flex flex-col sm:flex-row gap-2">
                      {profile?.connectionStatus === "connected" && (
                        <div className="flex flex-col items-center sm:items-end gap-1">
                          <Button
                            variant="outline"
                            className="gap-2 border-green-600 text-green-600 bg-green-50/50 hover:bg-green-50"
                            disabled
                          >
                            <Check size={16} /> Connected
                          </Button>
                          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                            You are friends
                          </span>
                        </div>
                      )}

                      {profile?.connectionStatus === "pending_sent" && (
                        <Button
                          variant="secondary"
                          className="gap-2 italic shadow-inner"
                          disabled
                        >
                          <Loader2 size={16} className="animate-spin" /> Pending
                          Approval
                        </Button>
                      )}

                      {profile?.connectionStatus === "pending_received" && (
                        <Button
                          className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md animate-pulse"
                          onClick={() => handleAcceptRequest(profile._id)}
                        >
                          <UserPlus size={16} /> Accept Request
                        </Button>
                      )}

                      {profile?.connectionStatus === "none" && (
                        <Button
                          className="gap-2 bg-primary hover:bg-primary/90 font-bold shadow-md hover:scale-105 transition-all"
                          onClick={() => handleSendRequest(profile._id)}
                        >
                          <UserPlus size={16} /> Connect with{" "}
                          {profile?.firstName}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
            {/* Info Form */}
            <Card className="p-8 border-none shadow-sm space-y-8 bg-card relative overflow-hidden">
              {/* Subtitle to clarify the view */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {isOwnProfile ? "Personal Information" : "Member Details"}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* EMAIL: Only visible to the owner */}
                  {isOwnProfile && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        Account Email (Private)
                      </label>
                      <div className="p-3 bg-muted/30 rounded-xl border border-dashed flex items-center gap-2 cursor-not-allowed group">
                        <Mail
                          size={16}
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                        <p className="text-sm font-medium text-muted-foreground italic">
                          {profile?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* FIRST NAME */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                      First Name
                    </label>
                    {isEditing && isOwnProfile ? (
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="h-11 bg-muted/50 focus:bg-background transition-all"
                      />
                    ) : (
                      <div
                        className={`p-3 rounded-xl border transition-all ${isOwnProfile ? "bg-muted/20 border-border/50" : "bg-background border-primary/10 shadow-sm"}`}
                      >
                        <p className="text-lg font-semibold text-foreground italic md:not-italic">
                          {profile?.firstName}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* LAST NAME */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                      Last Name
                    </label>
                    {isEditing && isOwnProfile ? (
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="h-11 bg-muted/50 focus:bg-background transition-all"
                      />
                    ) : (
                      <div
                        className={`p-3 rounded-xl border transition-all ${isOwnProfile ? "bg-muted/20 border-border/50" : "bg-background border-primary/10 shadow-sm"}`}
                      >
                        <p className="text-lg font-semibold text-foreground italic md:not-italic">
                          {profile?.lastName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* PHONE: Masked for public view */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                      Phone Number
                    </label>
                    {isEditing && isOwnProfile ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-11 bg-muted/50 focus:bg-background transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/50 flex items-center gap-3">
                        <div className="p-1.5 bg-background rounded-lg shadow-sm">
                          <Phone size={16} className="text-primary" />
                        </div>
                        <p
                          className={`text-lg font-medium ${!isOwnProfile ? "text-muted-foreground tracking-widest" : "text-foreground"}`}
                        >
                          {isOwnProfile
                            ? profile?.phone || "Not set"
                            : "••••••••••"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CITY / LOCATION */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                      City / Location
                    </label>
                    {isEditing && isOwnProfile ? (
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="h-11 bg-muted/50 focus:bg-background transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-muted/20 rounded-xl border border-border/50 flex items-center gap-3">
                        <div className="p-1.5 bg-background rounded-lg shadow-sm">
                          <MapPin size={16} className="text-orange-600" />
                        </div>
                        <p className="text-lg font-medium text-foreground">
                          {profile?.city || "Texas"}, TX
                        </p>
                      </div>
                    )}
                  </div>

                  {/* MEMBER STATUS (Only for public view) */}
                  {!isOwnProfile && (
                    <div className="pt-2">
                      <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl flex items-center gap-3">
                        <Shield size={20} className="text-primary" />
                        <div>
                          <p className="text-[10px] font-bold uppercase text-primary tracking-tighter">
                            Verified Status
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Community member in good standing.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SAVE BUTTON: Only visible during editing */}
              {isEditing && isOwnProfile && (
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

          {/* 3. Security & Privacy - ONLY rendered if it's the user's own profile */}
          {isOwnProfile && (
            <TabsContent
              value="security"
              className="space-y-6 mt-0 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              {/* Update Password Section */}
              <Card className="p-8 border-none shadow-sm bg-card">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Lock size={18} className="text-primary" /> Update Password
                </h3>
                <div className="max-w-sm space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.current}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          current: e.target.value,
                        })
                      }
                      className="bg-muted/30 focus:bg-background transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={passwordData.new}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          new: e.target.value,
                        })
                      }
                      className="bg-muted/30 focus:bg-background transition-all"
                    />
                  </div>
                  <Button
                    onClick={handlePasswordChange}
                    className="w-full md:w-auto px-8 shadow-md"
                  >
                    Update Password
                  </Button>
                </div>
              </Card>

              {/* Danger Zone Section */}
              <Card className="p-8 border-none shadow-sm border-l-4 border-l-destructive bg-destructive/5 space-y-6 relative overflow-hidden">
                {/* Background Icon for styling */}
                <AlertTriangle className="absolute -right-4 -bottom-4 w-32 h-32 text-destructive/10 -rotate-12 pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-destructive">
                    <Shield size={18} /> Account Privacy & Control
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    Deactivating your account will hide your profile from other
                    members until you log back in.
                    <span className="font-bold text-destructive">
                      {" "}
                      Deletion is permanent
                    </span>{" "}
                    and cannot be undone.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 relative z-10">
                  <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-white transition-all"
                    onClick={handleDeactivate}
                  >
                    <Power size={16} className="mr-2" /> Deactivate Account
                  </Button>

                  <Button
                    variant="destructive"
                    className="font-bold shadow-lg shadow-destructive/20"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="animate-spin mr-2" size={16} />
                    ) : (
                      <Trash2 size={16} className="mr-2" />
                    )}
                    Delete Account Permanently
                  </Button>
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
