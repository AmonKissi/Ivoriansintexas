import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link to imports
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, Mail, Lock, User, MapPin, 
  ArrowRight, CheckCircle2, Phone, Loader2 
} from "lucide-react";
import API from "@/lib/api-configs";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const benefits = [
    "Access to exclusive community events",
    "Professional networking opportunities",
    "Support during life transitions",
    "Cultural preservation initiatives"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Call your Node.js backend signup route
      await API.post("/auth/signup", formData);

      // 2. Success Toast
      toast({
        title: "Account Created!",
        description: "Akwaba! Please sign in with your new credentials.",
      });

      // 3. Redirect to login page
      navigate("/login");
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4 mt-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Value Proposition */}
          <div className="hidden lg:block space-y-8">
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              Join the <span className="text-primary">AIT</span> Family
            </h1>
            <p className="text-xl text-muted-foreground">
              Be part of a vibrant community dedicated to mutual support and celebrating our Ivorian heritage, no matter where you are.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center text-foreground font-medium">
                  <CheckCircle2 className="text-secondary mr-3" size={24} />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Sign Up Form */}
          <div className="bg-card p-8 rounded-2xl shadow-elegant border border-border w-full max-w-md mx-auto">
            <div className="text-center mb-8 lg:text-left">
              <div className="inline-flex items-center justify-center lg:hidden w-12 h-12 rounded-full bg-muted mb-4 text-primary">
                <UserPlus size={24} />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
              <p className="text-muted-foreground mt-2">Connect with the Ivorian diaspora</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jean" 
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Kouadio" 
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.k@example.com" 
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000" 
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your current city" 
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit"
                  size="lg" 
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-all shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground">
                Already a member?{" "}
                {/* Fixed internal Link */}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;