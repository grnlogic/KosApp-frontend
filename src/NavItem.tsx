import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition duration-200 flex items-center justify-center 
        ${
          isActive
            ? "bg-orange-500 text-white"
            : "hover:bg-orange-500 hover:text-white text-gray-600"
        }
      `}
    >
      <span className="transition duration-200">{icon}</span>
    </button>
  );
};

export default NavItem;
