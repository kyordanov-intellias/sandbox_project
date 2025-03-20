import { FC } from "react";
import { Link } from "react-router-dom";
import { Home, MessageSquare, Users, User } from "lucide-react";

const Header: FC = () => {
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
          <Link to="/messenger" className="nav-link">
            <MessageSquare size={20} />
            Messenger
          </Link>
          <Link to="/profile" className="nav-link">
            <User size={20} />
            Profile
          </Link>
          <Link to="/register" className="join-button">
            Join Now
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
