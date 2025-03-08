import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isLoggedIn,
  isAdmin,
  adminOnly = false,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
  adminOnly?: boolean;
}) => {
  // Jika user belum login, arahkan ke halaman login
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Jika halaman hanya untuk admin, tetapi user bukan admin, arahkan ke home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
