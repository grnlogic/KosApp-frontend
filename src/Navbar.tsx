import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import { LogOut, User } from "lucide-react"; // Tambahkan User
import Nofication from "./component/notification"; // Tambahkan Notification
import Profile from "./component/Profile"; // Tambahkan Profile

const HomeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
  </svg>
);

const Navbar = ({
  setIsLoggedIn,
}: {
  setIsLoggedIn: (value: boolean) => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-orange-100 px-4 py-2 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <span className="font-bold text-gray-700">MiminKost</span>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4">
          <NavItem
            icon={HomeIcon} // icon home
            isActive={location.pathname === "/"}
            onClick={() => navigate("/home")}
          />
          <NavItem
            icon={<User size={24} />} // icon user
            isActive={location.pathname === "/profile"}
            onClick={() => navigate("/Profile")}
          />
          <NavItem
            icon={<LogOut size={24} />} // icon logout
            onClick={() => {
              setIsLoggedIn(false);
              navigate("/");
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
