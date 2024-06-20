import React, { useState, useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useFormContext, Controller } from "react-hook-form";
const MessageForm = React.forwardRef(({ onSubmit, onChange, ...rest }, ref) => {
  const [openPicker, setOpenPicker] = useState(false);
  const { control, handleSubmit, setValue, getValues } = useFormContext();
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setOpenPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedEmoji = (emoji) => {
    const currentValue = getValues("message") || "";
    setValue("message", currentValue + emoji.native, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#202C33] relative py-2 px-3 flex flex-[0.07] items-center space-x-2"
    >
      <i
        onClick={() => setOpenPicker(!openPicker)}
        className="fa-solid fa-smile text-lg text-slate-300 cursor-pointer hover:text-white duration-300"
      ></i>
      {openPicker && (
        <div ref={pickerRef} className="absolute bottom-20 w-[280px]">
          <Picker data={data} onEmojiSelect={selectedEmoji} />
        </div>
      )}
      <Controller
        name="message"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input
            {...field}
            {...rest}
            ref={ref}
            autoComplete="off"
            type="text"
            placeholder="Type a Message"
            onFocus={() => setOpenPicker(false)}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) onChange(e);
            }}
            onClick={() => setOpenPicker(false)}
            className="bg-[#2A3942] p-2 flex flex-1 outline-none border border-transparent rounded-md focus:border-blue-500"
          />
        )}
      />
      <button type="submit">
        <i className="fa-solid fa-paper-plane rotate-45 cursor-pointer text-[#68747c] text-xl"></i>
      </button>
    </form>
  );
});

export default MessageForm;
