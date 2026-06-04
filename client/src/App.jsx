import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import { ToastViewport } from "./components/Toast.jsx";
import Landing from "./pages/app/Landing.jsx";
import Login from "./pages/app/Login.jsx";
import Home from "./pages/app/Home.jsx";
import Room from "./pages/app/Room.jsx";
import Profile from "./pages/app/Profile.jsx";
import Settings from "./pages/app/Settings.jsx";
import Notifications from "./pages/app/Notifications.jsx";
import Search from "./pages/app/Search.jsx";
import Explore from "./pages/app/Explore.jsx";
import Reels from "./pages/app/Reels.jsx";
import Messages from "./pages/app/Messages.jsx";
import CreatePost from "./pages/app/CreatePost.jsx";
import NotFound from "./pages/app/NotFound.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminChatRooms from "./pages/admin/ChatRooms.jsx";
import AdminReports from "./pages/admin/Reports.jsx";
import AdminBlockedUsers from "./pages/admin/BlockedUsers.jsx";
import AdminMessagesMonitoring from "./pages/admin/MessagesMonitoring.jsx";
import AdminAnnouncements from "./pages/admin/Announcements.jsx";
import AdminSettings from "./pages/admin/Settings.jsx";
import { useAuthStore } from "./store/authStore.js";

function RequireAuth({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Login initialMode="register" /></GuestOnly>} />
        <Route path="/signup" element={<GuestOnly><Login initialMode="register" /></GuestOnly>} />
        <Route path="/dashboard" element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="explore" element={<Explore />} />
          <Route path="reels" element={<Reels />} />
          <Route path="messages" element={<Messages />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="rooms/:roomId" element={<Room />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="/chat" element={<Navigate to="/dashboard/messages" replace />} />
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="chat-rooms" element={<AdminChatRooms />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="blocked-users" element={<AdminBlockedUsers />} />
          <Route path="messages-monitoring" element={<AdminMessagesMonitoring />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastViewport />
    </>
  );
}
