// src/pages/VerifyEmail.tsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "@/lib/api-configs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No token provided.");
        return;
      }

      try {
        // Points to your backend PORT 5000
        const response = await API.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-t-4 border-t-orange-500">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto animate-spin text-orange-500" size={40} />
            <h2 className="text-xl font-bold text-slate-800">Verifying your account...</h2>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="mx-auto text-green-500" size={60} />
            <h2 className="text-2xl font-bold text-slate-900">Akwaba!</h2>
            <p className="text-slate-600">{message}</p>
            <Button onClick={() => navigate("/login")} className="w-full bg-green-600 hover:bg-green-700">
              Proceed to Login
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <XCircle className="mx-auto text-red-500" size={60} />
            <h2 className="text-xl font-bold text-slate-900">Verification Failed</h2>
            <p className="text-slate-600">{message}</p>
            <Button variant="outline" onClick={() => navigate("/signup")} className="w-full">
              Back to Sign Up
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmail;