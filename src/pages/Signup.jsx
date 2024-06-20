import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { formField } from "@/data/formFields";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { postData } from "@/api/postData";
import { useGlobalContext } from "@/context/GlobalContext";
import toast from "react-hot-toast";
const Signup = ({ setTabValue }) => {
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();
  const [submitText, setSubmitText] = useState("Submit");
  const { setUser } = useGlobalContext();
  const form = useForm({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const { handleSubmit, register, getValues } = form;
  const registerUserMutation = useMutation(
    async () => {
      const data = new FormData();
      const formData = getValues();
      data.append("fullname", formData.fullname);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("picture", picture);
      return postData(`user/register`, data);
    },
    {
      onMutate: () => {
        setSubmitText("Processing...");
      },
      onError: (error) => {
        if (error) {
          toast.error(error.response.data.message);
          setSubmitText("Retry");
          setTimeout(() => {
            setSubmitText("Submit");
          }, 1200);
        }
      },

      onSuccess: ({ data }) => {
        if (data) {
          setSubmitText("Submit");
          toast.success("Successfully signed Up");
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          navigate("/chats/conversations");
        }
      },
    }
  );

  const onSubmit = async (data) => {
    data.picture = picture;
    await registerUserMutation.mutateAsync(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="">
      <Card className="text-white border-none">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription
            onClick={() => setTabValue("login")}
            className="text-blue-500 cursor-pointer hover:underline "
          >
            Already have an account? Login
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          {formField.slice(0, formField?.length - 1)?.map((field, index) => (
            <div key={field.id + index} className="space-y-1">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                className="bg-transparent"
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.id)}
              />
            </div>
          ))}
          <div className="space-y-1">
            <Label htmlFor={"picture"}>Profile Picture</Label>
            <Input
              className="bg-transparent"
              id={"picture"}
              name={"picture"}
              type={"file"}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setPicture(file);
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} type="submit">
            {submitText}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Signup;
