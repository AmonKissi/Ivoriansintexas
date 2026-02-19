import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { Loader2, ShieldCheck } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast({ variant: "destructive", title: "Mismatch", description: "Passwords do not match." });
    }

    setLoading(true);
    try {
      await API.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword: password });
      toast({ title: "Success!", description: "Password updated. You can now log in." });
      navigate("/login");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Invalid or expired token." });
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="h-screen flex items-center justify-center">Invalid Request. Token missing.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border shadow-xl">
        <div className="text-center">
          <ShieldCheck className="mx-auto text-primary h-12 w-12 mb-2" />
          <h1 className="text-3xl font-black tracking-tighter uppercase">New Password</h1>
          <p className="text-muted-foreground mt-2">Secure your AIT account below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12"
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12"
          />
          <Button className="w-full h-12 font-bold uppercase tracking-widest" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;