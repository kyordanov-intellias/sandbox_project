import { FC, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.styles.css"; // Import the CSS file for Header

interface User {
  profilePic: string;
  name: string;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <header>
      {/* Navigation Links */}
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/messenger">Messenger</Link>
      </nav>

      {/* Search Input */}
      <div>
        <input type="text" placeholder="Search..." />
      </div>

      {/* User Menu */}
      <div className="user-menu">
        {user ? (
          <>
            <img src={user.profilePic} alt="User Profile" />
            <Link to="/profile">{user.name}</Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
