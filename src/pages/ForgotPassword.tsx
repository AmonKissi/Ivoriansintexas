import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import API, { ENDPOINTS } from "@/lib/api-configs";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      setSubmitted(true);
      toast({ title: "Check your email", description: "If an account exists, we sent a reset link." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Failed to send request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter">RESET ACCESS</h1>
          <p className="text-muted-foreground mt-2">Enter your email to receive a secure link.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button className="w-full h-12 font-bold uppercase tracking-widest" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="bg-green-500/10 text-green-600 p-4 rounded-xl mb-6">
              <Mail className="mx-auto mb-2" />
              <p className="font-bold">Check your inbox!</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">We've sent recovery instructions to <b>{email}</b>.</p>
          </div>
        )}

        <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;