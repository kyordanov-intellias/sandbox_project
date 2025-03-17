import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Import useUser hook
import "./Header.styles.css"; // Import the CSS file for Header

const Header = () => {
  const { user, logout } = useUser();
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
            <p>
              {user.firstName} {user.lastName}
            </p>
            <Link to="/profile">{user.email}</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
