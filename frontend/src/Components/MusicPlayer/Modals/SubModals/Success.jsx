import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const Success = () => {
  const navigate = useNavigate();

  // Handle the button click to navigate back to home
  const handleGoHome = () => {
    navigate("/home"); // Navigate back to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Album Upload Successfully!</h1>
      <Button
        type="primary"
        size="large"
        onClick={handleGoHome}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Home
      </Button>
    </div>
  );
};

export default Success;
