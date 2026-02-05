import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import { LogOut, User } from "lucide-react";

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
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const Navbar = ({
  setIsLoggedIn,
  roomId,
}: {
  setIsLoggedIn: (value: boolean) => void;
  roomId: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // if (!window.googleTranslateElementInit) {
    //   window.googleTranslateElementInit = () => {
    //     if (window.google && window.google.translate) {
    //       try {
    //         new window.google.translate.TranslateElement(
    //           {
    //             pageLanguage: "id",
    //             includedLanguages: "en,id,ja,fr,de,es", // Add more languages as needed
    //             layout:
    //               window.google.translate.TranslateElement.InlineLayout.SIMPLE,
    //             autoDisplay: false,
    //           },
    //           "google_translate_element"
    //         );
    //       } catch (error) {
    //         console.error("Error initializing Google Translate:", error);
    //       }
    //     } else {
    //       console.error("Google Translate API is not available.");
    //     }
    //   };
    //   const script = document.createElement("script");
    //   script.src =
    //     "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    //   script.async = true;
    //   script.onerror = () => {
    //     console.error("Failed to load Google Translate script.");
    //   };
    //   document.body.appendChild(script);
    //   return () => {
    //     document.body.removeChild(script);
    //     delete window.googleTranslateElementInit;
    //   };
    // }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-yellow-500 text-white shadow-md px-4 py-3 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-xl">MiminKost</span>
        </div>

        <div className="flex items-center space-x-4">
          <NavItem
            icon={HomeIcon}
            isActive={location.pathname === `/room/${roomId}`}
            onClick={() => navigate(`/room/${roomId}`)}
          />
          <NavItem
            icon={<User size={24} />}
            isActive={location.pathname === `/room/${roomId}/profile`}
            onClick={() => navigate(`/room/${roomId}/profile`)}
          />
          <NavItem
            icon={<LogOut size={24} />}
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
