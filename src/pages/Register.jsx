import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Signup from "./Signup";
import Login from "./Login";
const Register = () => {
  const [tabValue, setTabValue] = useState("login");
  return (
    <div className="min-h-screen w-full flex justify-center  py-5">
      <Tabs value={tabValue} className="w-[800px] mx-3">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700 text-white  text-4xl ">
          <TabsTrigger onClick={() => setTabValue("login")} value="login">
            Login
          </TabsTrigger>
          <TabsTrigger onClick={() => setTabValue("signup")} value="signup">
            SignUp
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login setTabValue={setTabValue} />
        </TabsContent>
        <TabsContent value="signup">
          <Signup setTabValue={setTabValue} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Register;
