import { FC } from "react";
import { Link } from "react-router-dom";
import { Home, MessageSquare, ShieldUser, BookUser } from "lucide-react";
import { useUser } from "../../context/UserContext";
import "./Header.styles.css";

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
            <BookUser size={24} />
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
                <MessageSquare size={24} />
              </Link>
              {user.userRole === "administrator" && (
                <Link to={`/admin`} className="nav-link">
                  <ShieldUser size={24} />
                </Link>
              )}
              <Link to={`/profile/${user.id}`} className="nav-link">
                <img
                  className="header-profile-img"
                  src={user.profile?.profileImage}
                  alt="user-profile-img"
                />
              </Link>

              <button className="logout-button" onClick={logout}>
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
