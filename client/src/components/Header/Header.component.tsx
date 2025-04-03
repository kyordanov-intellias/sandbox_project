import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, MessageSquare, Users, User, ShieldUser } from "lucide-react";
import { useUser } from "../../context/UserContext";
import "./Header.styles.css";

const Header: FC = () => {
  const { user, logout } = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; firstName: string; lastName: string; profileImage: string }[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Add a debounce delay to reduce the number of requests
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query.length > 0) {
        fetch(`http://localhost:4000/users/search?query=${query}&limit=5`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data);
            setShowDropdown(true);
          })
          .catch(() => setShowDropdown(false));
      } else {
        setShowDropdown(false);
      }
    }, 500); // Wait 500ms after the user stops typing before making the request

    // Clean up the timeout if the query changes before the debounce delay
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="nav-link">
          <Home size={24} />
        </Link>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Small delay to allow clicks
          />
          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              <ul>
                {results.map((user) => (
                  <li key={user.id} onMouseDown={(e) => e.preventDefault()}>
                    <Link
                      to={`/profile/${user.id}`}
                      className="search-result-item"
                    >
                      <img
                        src={user.profileImage || "/default-avatar.png"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="user-avatar"
                      />
                      {user.firstName} {user.lastName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <nav className="nav-links">
          <Link to="/posts" className="nav-link">
            <Users size={20} />
            Posts
          </Link>
          {!user ? (
            <Link to="/login" className="join-button">
              Join Now
            </Link>
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
              {user.userRole === "administrator" && (
                <Link to={`/admin`} className="nav-link">
                  <ShieldUser size={20} />
                  Admin
                </Link>
              )}
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
