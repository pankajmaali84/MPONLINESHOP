import { BrowserRouter as Router,Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Home from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import Navbar from "./component/Navbar";
import { Services } from "./pages/Services";
import { NotFound } from "./pages/NotFound";
import Login from "./component/Login";
import Register from "./component/Register";
import ApplyForm from "./pages/ApplyForm";
import { DarkModeContext } from "./context/DarkModeContext.jsx";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminRoute from "./component/AdminRoute";
import { isTokenExpired } from "./utils/auth.jsx";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./component/PageTransition";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import MyProfile from "./pages/profile/MyProfile.jsx";
import RequestedServices from "./pages/profile/RequestedServices.jsx";
import AdminLogin from "./component/AdminLogin";
import { getRoleFromToken } from "./utils/auth";
import ForgotPassword from "./pages/ForgotPassword.jsx";

function ApplyGate() {
  const location = useLocation();
  const hasType = new URLSearchParams(location.search).get('type');
  if (!hasType) {
    return <Navigate to="/service" replace />;
  }
  return (
    <PageTransition>
      <ApplyForm />
    </PageTransition>
  );
}
console.log("API Base URL:", import.meta.env.VITE_API_URL);

function AppRoot() {
  const { darkMode } = useContext(DarkModeContext);
  // Track auth changes so that isAuthed updates immediately after login/logout
  const [authVersion, setAuthVersion] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') setAuthVersion((v) => v + 1);
    };
    const onAuthChanged = () => setAuthVersion((v) => v + 1);
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth:changed', onAuthChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth:changed', onAuthChanged);
    };
  }, []);

  const token = localStorage.getItem("token");
  const isAuthed = token && !isTokenExpired(token);
  const role = getRoleFromToken(token);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProfileRoute = location.pathname.startsWith('/profile');

  // If admin is authenticated and not currently on /admin routes, redirect them to /admin
  if (isAuthed && role === 'admin' && !isAdminRoute) {
    return <Navigate to="/admin" replace />;
  }
  return (
    <>
      <div className="min-h-screen transition-colors">
        {!isAuthed && <Navbar />}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: { background: '#111827', color: '#fff' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }}
        />
        <div className={!isAuthed ? "pt-16" : ""}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Default route: admins -> /admin, users -> /home, guests -> /login */}
              <Route path="/" element={<Navigate to={isAuthed ? (role === 'admin' ? "/admin" : "/home") : "/login"} replace />} />

              {/* Public routes (only when not authed) */}
              <Route
                path="/login"
                element={
                  isAuthed ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <PageTransition>
                      <Login />
                    </PageTransition>
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isAuthed ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <PageTransition>
                      <Register />
                    </PageTransition>
                  )
                }
              />
              <Route
                path="/forgot-password"
                element={
                  isAuthed ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <PageTransition>
                      <ForgotPassword />
                    </PageTransition>
                  )
                }
              />

              {/* Admin login (separate) */}
              <Route
                path="/admin-login"
                element={
                  isAuthed
                    ? (role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />)
                    : (
                        <PageTransition>
                          <AdminLogin />
                        </PageTransition>
                      )
                }
              />

              {/* Protected user routes under UserLayout (sidebar) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<PageTransition><Home /></PageTransition>} />
                <Route path="about" element={<PageTransition><About /></PageTransition>} />
                <Route path="service" element={<PageTransition><Services /></PageTransition>} />
                <Route path="apply" element={<ApplyGate />} />
                <Route path="contact" element={<PageTransition><Contact /></PageTransition>} />
              </Route>
              {/* User profile routes with sidebar layout */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/profile/requested-services" replace />} />
                <Route
                  path="my-profile"
                  element={<PageTransition><MyProfile /></PageTransition>}
                />
                <Route
                  path="requested-services"
                  element={<PageTransition><RequestedServices /></PageTransition>}
                />
              </Route>
              {/* Admin routes with sidebar layout */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="orders" element={<Orders />} />
              </Route>
              {/* <Route path="/profile" element={<Profile />} /> */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </>
  )

}

// Keep BrowserRouter at the top level so useLocation works
function App() {
  return (
    <Router>
      <AppRoot />
    </Router>
  );
}

export default App;