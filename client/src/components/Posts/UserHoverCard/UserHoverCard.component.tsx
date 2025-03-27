import { Link } from "react-router-dom";
import type { User } from "../types";
import "./UserHoverCard.styles.css";

interface UserHoverCardProps {
  user: User;
}

export function UserHoverCard({ user }: UserHoverCardProps) {
  return (
    <div className="hover-card">
      <div className="hover-card-content">
        <img src={user.avatar} alt={user.name} className="hover-card-avatar" />
        <div>
          <Link to={`/profile/${user.id}`} className="hover-card-name">
            {user.name}
          </Link>
          <div className="hover-card-role">{user.role}</div>
        </div>
      </div>
    </div>
  );
}
