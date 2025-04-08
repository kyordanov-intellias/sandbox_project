import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, MessageSquare, ShieldUser, BookUser } from "lucide-react";
import { useUser } from "../../context/UserContext";
import debounce from "lodash/debounce";
import "./Header.styles.css";

const Header: FC = () => {
  const { user, logout } = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    {
      id: string;
      authId: string;
      profileImage: string;
      firstName: string;
      lastName: string;
    }[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = debounce((query: string) => {
    if (query.length === 0) {
      setShowDropdown(false);
      setResults([]);
      return;
    }

    setLoading(true);
    
    fetch(`http://localhost:4000/users/search?query=${query}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setShowDropdown(true);
      })
      .catch(() => {
        setResults([]);
        setShowDropdown(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, 500);

  useEffect(() => {
    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel();
    };
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
            onBlur={() => {
              setFadeOut(true);
              setTimeout(() => {
                setShowDropdown(false);
                setFadeOut(false);
              }, 200);
            }}
          />

          {showDropdown && (
            <div
              className={`search-dropdown ${fadeOut ? "fade-out" : ""} ${
                results.length === 0 ? "no-results" : ""
              }`}
            >
              {loading ? (
                <div className="search-loading">Searching...</div>
              ) : results.length > 0 ? (
                <ul>
                  {results.map((user) => (
                    <li key={user.id} onMouseDown={(e) => e.preventDefault()}>
                      <Link
                        to={`/profile/${user.authId}`}
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
              ) : (
                <div className="no-results-text">No users found</div>
              )}
            </div>
          )}
        </div>

        <nav className="nav-links">
          <Link to="/posts" className="nav-link">
            <BookUser size={24} />
          </Link>
          {!user ? (
            <Link to="/login" className="join-button">
              Join Now
            </Link>
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
                  src={user.profile?.profileImage || "/default-avatar.png"}
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
