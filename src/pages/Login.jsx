import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { postData } from "@/api/postData";
import { useGlobalContext } from "@/context/GlobalContext";
import toast from "react-hot-toast";
const Login = ({ setTabValue }) => {
  const [submitText, setSubmitText] = useState("Submit");
  const navigate = useNavigate();
  const { setUser, setSelectedUser, setSelectedChat, setSelectedGroup } =
    useGlobalContext();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, register, formState } = form;
  const { errors } = formState;
  const loginUserMutation = useMutation(
    (data) => {
      return postData("user/login", data);
    },
    {
      onMutate: () => {
        setSubmitText("Processing..");
      },
      onError: (error) => {
        if (error) {
          console.log(error);
          setSubmitText("Retry");
          setTimeout(() => {
            setSubmitText("Submit");
          }, 1200);
        }
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Network Error");
        }
      },
      onSuccess: ({ data }) => {
        setSubmitText("Submit");
        if (data) {
          setSelectedChat(null);
          setSelectedGroup(null);
          setSelectedUser(null);
          navigate("/chats/conversations");

          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      },
    }
  );
  const onSubmit = async (data) => {
    console.log("uri", import.meta.env.MODE);
    await loginUserMutation.mutateAsync(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card className="text-white border-none">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription
            onClick={() => {
              setTabValue("signup");
            }}
            className="text-blue-500 cursor-pointer hover:underline w-fit"
          >
            Don't have an account? Signup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              className="bg-transparent focus"
              placeholder="example@gmail.com"
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            <p>{errors?.email?.message}</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              className="bg-transparent"
              id="password"
              placeholder="John_123"
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <p>{errors?.password?.message}</p>
          </div>
          <CardDescription
            onClick={() => navigate("/forget-password")}
            className="text-blue-500 cursor-pointer hover:underline w-fit"
          >
            Forget Password? Click here.
          </CardDescription>
        </CardContent>

        <CardFooter>
          <Button>{submitText}</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Login;
