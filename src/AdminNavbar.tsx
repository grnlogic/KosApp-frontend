import React from "react";
import Cookies from "js-cookie"; // Import js-cookie

const AdminNavbar = ({
  setIsLoggedIn,
}: {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <nav>
      {/* Konten Navbar untuk admin */}
      <button
        onClick={() => {
          setIsLoggedIn(false);
          Cookies.remove("authToken"); // Hapus token dari cookies
        }}
      >
        Logout
      </button>
      <button>Another Button</button>
    </nav>
  );
};

export default AdminNavbar;
