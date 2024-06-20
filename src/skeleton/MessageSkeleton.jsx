import React from "react";
import Skeleton from "react-loading-skeleton";
const MessageSkeleton = ({ index }) => {
  return (
    <div
      className={` w-full ${
        index % 2 === 0 ? "justify-end" : "justify-start"
      }   flex space-x-2  `}
    >
      <Skeleton baseColor="#111B21" className="w-8 h-8 rounded-full" />
      <div className="">
        <p className="text-sm text-slate-300">
          <Skeleton baseColor="#111B21" className="h-2 w-16" />
        </p>
        <div
          className={` px-3 flex flex-col bg-slate-700 space-y-1 py-2 rounded-md`}
        >
          <p className="text-wrap  break-normal">
            <Skeleton baseColor="#111B21" className="sm:w-52 w-40" />
          </p>
          <p className="text-[10px] text-end pl-7">
            <Skeleton baseColor="#111B21" className="w-16" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
