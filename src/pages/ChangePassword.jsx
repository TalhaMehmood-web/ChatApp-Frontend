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
import { CHANGE_PASSWORD_FORM as formValues } from "@/utils/FormFields";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState("Save Changes");
  const form = useForm({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { handleSubmit, register, formState, reset } = form;
  const { errors } = formState;
  const changePasswordMutation = useMutation(
    (data) => updateData("user/change-password", data),
    {
      onMutate: () => {
        setLoadingText("Processing...");
      },
      onError: (error) => {
        if (error) setLoadingText("Retry");
        setTimeout(() => {
          setLoadingText("Save Changes");
        }, 1200);
      },
      onSuccess: (data) => {
        if (data) {
          reset();
          setLoadingText("Updated");
          navigate(-1);
        }
      },
    }
  );

  const changePassword = async (data, e) => {
    if (data.currentPassword.trim() == data.newPassword.trim()) {
      return toast.error("Nothing to update");
    }
    if (data.newPassword.trim() !== data.confirmNewPassword.trim()) {
      return toast.error("Password not matched");
    }

    e.preventDefault();
    await changePasswordMutation.mutateAsync(data);
  };
  return (
    <div className="flex flex-1 flex-col items-center mt-20 text-white">
      <form
        onSubmit={handleSubmit(changePassword)}
        className="flex flex-1 flex-col w-full items-center"
        noValidate
      >
        <Card className="border-none text-white w-[90%] sm:w-[80%] lg:w-[50%]">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
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
                  id={input.id}
                  name={input.id}
                  placeholder={input.placeholder}
                  className="bg-slate-700 border-slate-800"
                  {...register(input.id, {
                    required: `${input.title} is Required `,
                    // pattern: {
                    //   value:
                    //     /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]/,
                    //   message:
                    //     "Password must have At least one special and one capital character ",
                    // },
                    // minLength: {
                    //   value: 8,
                    //   message: "Minimum 8 letters are required",
                    // },
                    // maxLength: {
                    //   value: 20,
                    //   message: "Password should not exceed 20 letters",
                    // },
                  })}
                />
                <p className="text-sm text-red-500">
                  {errors[input.id]?.message}
                </p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit">{loadingText}</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ChangePassword;
