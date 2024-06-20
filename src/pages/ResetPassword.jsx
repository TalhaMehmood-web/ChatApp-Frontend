import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { updateData } from "@/api/updateData";
import { RESET_PASSWORD_FORM as formValues } from "@/utils/FormFields";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/GlobalContext";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState("Save Changes");
  const [error, setError] = useState("");
  const { OTP } = useGlobalContext();
  const form = useForm({
    resetPasswordToken: "",
    password: "",
    confirmPassword: "",
  });

  const { handleSubmit, register, formState, reset } = form;
  const { errors } = formState;
  const resetPasswordMutation = useMutation(
    (data) => updateData("user/reset-password", data),
    {
      onMutate: () => {
        setLoadingText("Processing...");
      },
      onError: (error) => {
        if (error) {
          setError(error.response.data.message);
          setLoadingText("Retry");
          setTimeout(() => {
            setLoadingText("Save Changes");
          }, 1200);
        }
      },
      onSuccess: ({ data }) => {
        if (data) {
          console.log(data);
          setLoadingText("Updated");
          toast.success(data.message);
          navigate("/");
        }
      },
    }
  );
  const resetPassword = async (data, e) => {
    if (OTP && OTP.trim() !== data.resetPasswordToken.trim()) {
      setError("You have entered Incorrect OTP");
      return;
    }
    if (data.password.trim() !== data.confirmPassword.trim()) {
      setError("Password Not Matched");
      return;
    }
    await resetPasswordMutation.mutateAsync(data);
  };
  return (
    <div className="flex flex-1 flex-col items-center mt-20 text-white">
      <form
        onSubmit={handleSubmit(resetPassword)}
        className="flex flex-1 flex-col w-full items-center"
        noValidate
      >
        <Card className="border-none text-white w-[90%] sm:w-[80%] lg:w-[50%]">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription className="text-slate-300">
              Enter your current password and new password , click on save
              changes when you're done!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 ">
            {formValues?.map((input) => (
              <div key={input.id} className="space-y-1">
                <Label htmlFor={input.id}>{input.title}</Label>
                <Input
                  required
                  type={input.type}
                  id={input.id}
                  name={input.id}
                  placeholder={input.placeholder}
                  className="bg-slate-700 border-slate-800"
                  {...register(input.id, {
                    required: `${input.title} is Required `,
                  })}
                />
                <p className="text-sm text-red-500">
                  {errors[input.id]?.message}
                </p>
              </div>
            ))}
            <p className="text-red-600 font-semibold italic">{error}</p>
          </CardContent>
          <CardFooter className="w-full flex items-center justify-between">
            <Button type="submit">{loadingText}</Button>
            <Button onClick={() => navigate(-1)} type="button">
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ChangePassword;
