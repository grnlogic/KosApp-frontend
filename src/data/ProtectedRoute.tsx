import { Navigate, Outlet, Route } from "react-router-dom";

const ProtectedRoute = ({
  isLoggedIn,
  isAdmin,
  authLoading,
  adminOnly = false,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  adminOnly?: boolean;
}) => {
  // Tampilkan loading indicator atau kosong saat sedang loading
  if (authLoading) {
    return null; // atau komponen loading seperti <LoadingSpinner />
  }

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
