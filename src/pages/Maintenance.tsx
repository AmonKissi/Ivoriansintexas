import { useState, useEffect } from "react";
import { ShieldAlert, Cog, Zap, UserCheck } from "lucide-react";
import API from "@/lib/api-configs";

const Maintenance = () => {
  const [adminName, setAdminName] = useState<string>("Authorized Personnel");

  useEffect(() => {
    const fetchMaintenanceDetails = async () => {
      try {
        // We hit the same status endpoint
        const { data } = await API.get("/admin/system-status");
        // If your backend populates the user, we can show the name
        // For now, let's assume it returns a string or we use a fallback
        if (data.updatedBy) {
          setAdminName(data.updatedBy); 
        }
      } catch (err) {
        console.error("Could not fetch maintenance lead details");
      }
    };
    fetchMaintenanceDetails();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />
      
      <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="relative inline-block">
          <div className="h-32 w-32 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border-2 border-amber-500/20">
            <Cog size={60} className="text-amber-500 animate-spin-slow" />
          </div>
          <Zap size={24} className="absolute -top-2 -right-2 text-primary animate-pulse" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-foreground">
            Under <br/> Maintenance
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Protocol: System Optimization In Progress
          </p>
          <div className="flex flex-col gap-1 items-center justify-center">
             <p className="text-muted-foreground max-w-sm mx-auto font-medium text-sm leading-relaxed">
              The Texas Registry is currently undergoing a Level 6 Security Audit. 
              Normal transmissions will resume shortly.
            </p>
            {/* NEW: Admin Signature */}
            <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-secondary/50 rounded-full border border-border/50">
              <UserCheck size={12} className="text-green-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">
                Lead: {adminName}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-12 flex flex-col items-center gap-2 opacity-40">
          <ShieldAlert size={16} />
          <span className="text-[8px] font-bold uppercase tracking-[0.5em]">
            Official AIT Administrative Lock
          </span>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;