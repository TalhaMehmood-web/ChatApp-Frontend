import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { postData } from "@/api/postData";
import { useGlobalContext } from "@/context/GlobalContext";
const ForgetPassword = () => {
  const [loadingText, setLoadingText] = useState("Submit");
  const { setOTP } = useGlobalContext();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });
  const { handleSubmit, register, formState } = form;
  const { errors } = formState;
  const forgetPasswordMutation = useMutation(
    (data) => postData("user/forget-password", data),
    {
      onMutate: () => {
        setLoadingText("Processing...");
      },
      onSuccess: ({ data }) => {
        setOTP(data.token);
        setLoadingText("Submit");
        toast.success(data.message, {
          position: "bottom-left",
        });
        navigate("/reset-password");
      },
      onError: (error) => {
        setLoadingText("Submit");
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Network Error");
        }
      },
    }
  );
  const forgetPassword = async (data) => {
    await forgetPasswordMutation.mutateAsync(data);
  };
  return (
    <div className="flex flex-1 flex-col items-center mt-10 text-white">
      <form
        onSubmit={handleSubmit(forgetPassword)}
        className="flex flex-1 flex-col w-full items-center"
        noValidate
      >
        <Card className="border-none text-white w-[90%] sm:w-[80%] lg:w-[40%]">
          <CardHeader>
            <CardTitle>Forget Password</CardTitle>
            <CardDescription className="text-slate-300">
              Enter your email address , we will send you an OTP which will be
              expired in one hour . <br /> Click on submit button when you are
              done
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 ">
            <div className="space-y-1">
              <Label htmlFor={"email"}>{"Email"}</Label>
              <Input
                required
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`bg-slate-700/50  border-slate-500`}
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                })}
              />
              <p className="text-red-600 mt-3">{errors?.email?.message}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between w-full items-center">
            <Button type="submit">{loadingText}</Button>
            <Button type="button" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ForgetPassword;
