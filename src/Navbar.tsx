import React, { useEffect, useState } from "react";
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
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const handleLanguageChange = (languageCode: string) => {
    // const iframe = document.querySelector(
    //   "iframe.goog-te-menu-frame"
    // ) as HTMLIFrameElement;
    // if (iframe) {
    //   const iframeDocument =
    //     iframe.contentDocument || iframe.contentWindow?.document;
    //   if (iframeDocument) {
    //     const languageLink = iframeDocument.querySelector(
    //       `a[lang="${languageCode}"]`
    //     ) as HTMLAnchorElement;
    //     if (languageLink) {
    //       languageLink.click();
    //     }
    //   }
    // }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-yellow-500 text-white shadow-md px-4 py-3 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-xl">MiminKost</span>
        </div>

        <div className="flex items-center space-x-4">
          <NavItem
            icon={HomeIcon}
            isActive={location.pathname === `/Home${roomId}`}
            onClick={() => navigate(`/Home${roomId}`)}
          />
          <NavItem
            icon={<User size={24} />}
            isActive={location.pathname === `/Profile${roomId}`}
            onClick={() => navigate(`/Profile${roomId}`)}
          />
          <NavItem
            icon={<LogOut size={24} />}
            onClick={() => {
              setIsLoggedIn(false);
              navigate("/");
            }}
          />

          <div className="relative">
            <button
              onClick={toggleLanguageDropdown}
              className="bg-yellow-600 text-white px-5 py-2 rounded-full font-medium hover:bg-yellow-700 transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6 6-6"/>
              </svg>
              Translate
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 z-50">
                {["en", "id", "ja", "fr", "de", "es"].map((code, index) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`block w-full text-left px-4 py-3 hover:bg-yellow-50 transition-colors duration-200 flex items-center ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <span className="w-8 h-5 inline-block mr-2 rounded border border-gray-200">
                      {/* Language flag/indicator placeholder */}
                    </span>
                    {
                      code === "en" ? "English" :
                      code === "id" ? "Indonesian" :
                      code === "ja" ? "Japanese" :
                      code === "fr" ? "French" :
                      code === "de" ? "German" : "Spanish"
                    }
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
