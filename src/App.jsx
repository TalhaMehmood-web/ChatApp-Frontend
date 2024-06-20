import "./App.css";
import "react-loading-skeleton/dist/skeleton.css";
import Conversation from "./pages/Conversation";
import Chat from "./pages/Chat";
import { Route, Routes } from "react-router-dom";
import GroupChat from "./pages/GroupChat";
import Archive from "./pages/Archive";
import Starred from "./pages/Starred";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import Notifications from "./pages/Notifications";
import { Toaster } from "react-hot-toast";

import ChangePassword from "./pages/ChangePassword";
import UpdateProfile from "./pages/UpdateProfile";
import ForgetPassword from "./pages/ForgetPassword";

import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <div className="min-h-screen w-full bg-[#151D30] flex overflow-hidden ">
      <Routes>
        <Route index={true} path="/" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/chats" element={<Chat />}>
          <Route index={true} path="users" element={<Users />} />
          <Route path="conversations" element={<Conversation />} />
          <Route path="groups" element={<GroupChat />} />
          <Route path="archive" element={<Archive />} />
          <Route path="starred" element={<Starred />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
