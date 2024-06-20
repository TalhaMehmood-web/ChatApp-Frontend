import React from "react";

const Indicator = ({ color }) => {
  return (
    <span
      className={` flex w-2 absolute top-3 left-11 h-2 me-3  rounded-full ${color}`}
    ></span>
  );
};

export default Indicator;
