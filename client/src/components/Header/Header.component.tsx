import { FC } from "react";
import { Link } from "react-router-dom";
import { Home, MessageSquare, Users, User } from "lucide-react";
import { useUser } from "../../context/UserContext";
import './Header.styles.css';

const Header: FC = () => {
  const { user, logout } = useUser();

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="nav-link">
          <Home size={24} />
        </Link>

        <nav className="nav-links">

          <Link to="/posts" className="nav-link">
            <Users size={20} />
            Posts
          </Link>
          {!user ? (
            <>
              <Link to="/login" className="join-button">
                Join Now
              </Link>
            </>
          ) : (
            <>
              <Link to="/messenger" className="nav-link">
                <MessageSquare size={20} />
                Messenger
              </Link>
              <Link to={`/profile/${user.id}`} className="nav-link">
                <User size={20} />
                Profile
              </Link>
              <button onClick={logout}>Log out</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
