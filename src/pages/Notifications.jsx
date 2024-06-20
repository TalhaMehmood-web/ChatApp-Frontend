import { useQuery } from "react-query";
import { fetchData } from "@/api/fetchData";
import { useGlobalContext } from "@/context/GlobalContext";

import NotificationItem from "@/components/ui/NotificationItem";

const Notifications = () => {
  const { user } = useGlobalContext();

  const { data: notifications } = useQuery(["notifications", user?._id], () =>
    fetchData("notifications")
  );

  return (
    <div className="flex flex-1 space-y-3 p-5 flex-col  ">
      <p className="text-2xl  bg-slate-800 py-3 px-2 text-center font-bold">
        Notification
      </p>
      <div className="flex flex-col  max-h-[600px] overflow-y-scroll overflow-x-hidden scroll scroll-smooth flex-1 my-2 border-t border-slate-700 py-2">
        {notifications &&
          notifications?.map((notification, index) => (
            <NotificationItem
              key={notification._id}
              senderName={notification.from.fullname}
              senderPicture={notification.from.picture}
              senderId={notification.from._id}
              message={notification.message}
              date={notification.createdAt}
              notificationIndex={index}
            />
          ))}
        {!notifications && (
          <div className="flex flex-1 justify-center items-center text-2xl font-semibold italic">
            No Notifications Yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
