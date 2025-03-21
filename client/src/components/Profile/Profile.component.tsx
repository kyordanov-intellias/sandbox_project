import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/userServices";
import { UserInterface } from "../../interfaces/userInterfaces";
import "./Profile.styles.css";

export const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    const fetchUser = async () => {
      const response = await getUserById(profileId!);
      const user = await response.json();
      setUser(user);
      setIsLoading(false);
    };
    fetchUser();
  }, [profileId]);

  if (isLoading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-cover">
        <img 
          src="https://images.supersport.com/media/5n1bzesq/barcelona-1200g.jpg?width=1920&quality=90&format=webp" 
          alt="Cover"
        />
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-picture">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" 
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <h1>{`${user?.first_name} ${user?.last_name}`}</h1>
            <span className="profile-role">{user?.role}</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>About</h2>
          <div className="profile-details">
            <div className="detail-item">
              <strong>Email:</strong>
              <span>{user?.email}</span>
            </div>
            <div className="detail-item">
              <strong>Role:</strong>
              <span>{user?.role}</span>
            </div>
            <div className="detail-item">
              <strong>Member since:</strong>
              <span>January 2024</span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="profile-section">
          <h2>You shared your opinion on</h2>
          <div className="profile-posts">
            {/* Placeholder posts - replace with actual data */}
            <div className="post-card">
              <h3>Post Title 1</h3>
              <p>Your comment: "This is a great perspective on the topic..."</p>
              <span className="post-date">2 days ago</span>
            </div>
            <div className="post-card">
              <h3>Post Title 2</h3>
              <p>Your comment: "I completely agree with this analysis..."</p>
              <span className="post-date">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
