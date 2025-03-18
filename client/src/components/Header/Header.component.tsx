import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Header.styles.css"; 

const Header = () => {
  const { user, logout } = useUser();
  return (
    <header>
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/messenger">Messenger</Link>
      </nav>

      <div>
        <input type="text" placeholder="Search..." />
      </div>

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
