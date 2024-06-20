import React from "react";
import Skeleton from "react-loading-skeleton";
const ConversationSkeleton = () => {
  return (
    <div className="flex items-center px-2 my-2 bg-slate-800 rounded-md">
      {/* image */}
      <div>
        <Skeleton baseColor="#111B21" className="w-12 h-12 rounded-full " />
      </div>

      <div className="flex items-start justify-between flex-1 py-2 mx-3 space-x-2 border-b border-slate-800 ">
        <div className="flex flex-col flex-1 space-y-2 cursor-pointer">
          <p className="text-lg whitespace-nowrap">
            <Skeleton baseColor="#111B21" />
          </p>

          <p className="text-[#70818b] text-sm me">
            <Skeleton baseColor="#111B21" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationSkeleton;
