import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { formField as formValues } from "@/data/formFields";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useGlobalContext } from "@/context/GlobalContext";
import { postData } from "@/api/postData";
import { updateData } from "@/api/updateData";
import toast from "react-hot-toast";
const UpdateProfile = () => {
  const { user, setUser } = useGlobalContext();
  const [loadingText, setLoadingText] = useState("Save Changes");
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      fullname: user?.fullname,
      username: user?.username,
      email: user?.email,
      picture: null,
    },
  });
  const { handleSubmit, register } = form;
  const updateProfileMutation = useMutation(
    (data) => updateData("user/update-profile", data),
    {
      onMutate: () => {
        setLoadingText("Processing...");
      },
      onSuccess: ({ data }) => {
        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          toast.success("Profile updated Successfully");
          setLoadingText("Updated");
          navigate("/");
        }
      },
    }
  );
  const updateProfile = async (data) => {
    if (
      data.fullname === user?.fullname &&
      data.email === user?.email &&
      data.username === user?.username &&
      !data.picture
    ) {
      return toast.error("Nothing to update");
    }
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("picture", data?.picture?.[0]);
    await updateProfileMutation.mutateAsync(formData);
  };
  return (
    <div className="flex flex-1 flex-col items-center mt-10 text-white">
      <form
        onSubmit={handleSubmit(updateProfile)}
        className="flex flex-1 flex-col w-full items-center"
        noValidate
      >
        <Card className="border-none text-white w-[90%] sm:w-[80%] lg:w-[50%]">
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
            <CardDescription className="text-slate-300">
              Click on save changes button when you're done!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 ">
            {[...formValues?.slice(0, 3), ...formValues?.slice(4, 5)]?.map(
              (input) => (
                <div key={input.id} className="space-y-1">
                  <Label htmlFor={input.id}>{input.label}</Label>
                  <Input
                    required
                    id={input.id}
                    type={input.type}
                    name={input.id}
                    placeholder={input.placeholder}
                    className="bg-slate-700 border-slate-800"
                    {...register(input.id)}
                  />
                </div>
              )
            )}
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

export default UpdateProfile;
