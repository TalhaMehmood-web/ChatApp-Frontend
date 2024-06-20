import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex bg-slate-800 text-white flex-1 flex-col space-y-4 justify-center items-center">
      <p className="text-2xl font-bold italic">Not found</p>
      <Button type="button" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
