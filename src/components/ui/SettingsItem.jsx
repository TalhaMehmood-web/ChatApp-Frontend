import React from "react";

const SettingsItem = ({ onClick, icon, title, color }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-10 text-lg font-light w-full ${color} cursor-pointer hover:bg-slate-800 pl-5  `}
    >
      <i className={`fa-solid  ${icon}`}></i>
      <p className="border-b flex-1  border-slate-700/30 py-4">{title}</p>
    </div>
  );
};

export default SettingsItem;
