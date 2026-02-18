import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the 404 error for debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex flex-grow flex-col items-center justify-center px-4 py-20 text-center">
        <div className="space-y-6">
          {/* Large 404 Text with Gradient */}
          <h1 className="text-9xl font-extrabold text-primary/20">404</h1>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Oops! Page not found
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              Akwaba, but it seems the path you are looking for—<span className="font-mono text-primary">{location.pathname}</span>—does not exist or has been moved.
            </p>
          </div>

          <div className="pt-4">
            <Link to="/">
              <Button size="lg" className="bg-gradient-primary gap-2 shadow-md">
                <Home size={18} />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;