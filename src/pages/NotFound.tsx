
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-6">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page <span className="font-medium">{location.pathname}</span> you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Button
            className="w-full bg-brand-300 hover:bg-brand-400"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/about")}
          >
            Visit About Page
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/services")}
          >
            Browse Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
