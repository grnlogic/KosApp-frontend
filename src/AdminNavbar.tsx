import React from "react";

const AdminNavbar = ({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <nav>
      {/* Konten Navbar untuk admin */}
      <button onClick={() => setIsLoggedIn(false)}>Logout</button>
      <button>Another Button</button>
    </nav>
  );
};

export default AdminNavbar;