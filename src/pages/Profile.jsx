import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalContext } from "@/context/GlobalContext";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { updateData } from "@/api/updateData";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useGlobalContext();
  const [editableField, setEditableField] = useState(null);

  const form = useForm({
    defaultValues: {
      phoneNumber: user?.phoneNumber,
      about: user?.about,
    },
  });
  const editProfileMutation = useMutation(
    (data) => updateData("user/settings", data),
    {
      onMutate: (data) => {
        const updatedUser = { ...user, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      },
      onError: (error) => {
        console.log(error);
      },
      onSuccess: ({ data }) => {
        return;
      },
    }
  );
  const editProfile = async (data) => {
    setEditableField(null);
    if (
      data?.about?.trim() === user?.about.trim() &&
      data?.phoneNumber?.trim() === user?.phoneNumber.trim()
    )
      return;

    await editProfileMutation.mutateAsync(data);
  };
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const isEditable = (field) => editableField === field;
  const border = isEditable ? "border-slate-700 " : "border-slate-300";
  return (
    <div className="flex flex-1 flex-col p-5 space-y-2">
      <p className="text-2xl font-bold text-slate-100">Profile</p>
      <div className="flex w-full justify-center">
        <img
          src={user?.picture}
          alt={user?.fullname}
          className="rounded-full w-52 h-52 object-cover "
        />
      </div>
      <form
        noValidate
        onSubmit={handleSubmit(editProfile)}
        className="flex flex-1 flex-col space-y-5 pt-6  "
      >
        <div className="flex flex-col space-y-2">
          <Label htmlFor="phoneNumber " className="text-xl">
            Phone Number
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="phoneNumber"
              type="phone"
              name="phoneNumber"
              className={`bg-transparent outline-none  ${border} `}
              placeholder="your phone number"
              readOnly={!isEditable("phoneNumber")}
              {...register("phoneNumber")}
            />
            {!isEditable("phoneNumber") ? (
              <i
                onClick={() => setEditableField("phoneNumber")}
                className="fa-solid fa-pen cursor-pointer"
              ></i>
            ) : (
              <button type="submit">
                <i className="fa-solid fa-check cursor-pointer"></i>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Label className="text-xl" htmlFor="about">
            About
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="about"
              type="text"
              name="about"
              className={`bg-transparent outline-none  ${border} `}
              placeholder="about"
              readOnly={!isEditable("about")}
              {...register("about")}
            />
            {!isEditable("about") ? (
              <i
                onClick={() => setEditableField("about")}
                className="fa-solid fa-pen cursor-pointer"
              ></i>
            ) : (
              <button type="submit">
                <i
                  onClick={editProfile}
                  className="fa-solid fa-check cursor-pointer"
                ></i>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
