import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, ShieldAlert, Map } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />
      <div className="absolute -slate-900 opacity-[0.03] -z-10 select-none pointer-events-none">
        <h1 className="text-[20rem] font-black italic uppercase leading-none">Lost</h1>
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        {/* Icon / Visual */}
        <div className="relative inline-block">
          <div className="h-32 w-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto rotate-12 mb-8 border-2 border-primary/20">
            <ShieldAlert size={60} className="text-primary -rotate-12" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce shadow-lg">
            !
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-foreground">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-primary italic">
            Frequency Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto font-medium text-sm md:text-base leading-relaxed">
            It looks like you've wandered outside the Ivorian Registry borders. 
            This transmission doesn't exist or has been purged from the system.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] gap-2 h-14 px-8 hover:bg-muted transition-all"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>

          <Button 
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 h-14 px-10 shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            <Home size={16} />
            Return to Dashboard
          </Button>
        </div>

        {/* Subtle Map Hint */}
        <div className="pt-12 opacity-30 flex items-center justify-center gap-2">
          <Map size={14} />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]">
            Texas Territory • Ivory Coast Soul
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;