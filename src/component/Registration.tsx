import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page (which has the registration with OTP flow)
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl">Redirecting to registration page...</h1>
    </div>
  );
};

export default Registration;
