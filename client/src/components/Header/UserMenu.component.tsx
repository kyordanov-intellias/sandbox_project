import { Link } from "react-router-dom";
import { useState } from "react";
import "./UserMenu.styles.css";

const UserMenu = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="user-menu">
      {isAuthenticated ? (
        <Link to="/profile" className="flex items-center space-x-2">
          <img src="https://via.placeholder.com/30" alt="Profile" />
          <span className="font-medium">Profile</span>
        </Link>
      ) : (
        <Link to="/login" className="text-lg font-medium">
          Sign In
        </Link>
      )}
    </div>
  );
};

export default UserMenu;
