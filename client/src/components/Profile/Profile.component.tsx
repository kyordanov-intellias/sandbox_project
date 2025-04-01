import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Heart,
  Repeat,
  HeartOff,
  Repeat as RepeatOff,
} from "lucide-react";
import "./Profile.styles.css";
import { useUser } from "../../context/UserContext";
import { EditProfile } from "./Edit-Profile/EditProfile.component";
import { EditFormData } from "../../interfaces/userInterfaces";
import { DEFAULT_IMAGES } from "../Register/defaultImages";

export default function Profile() {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<"liked" | "reposted">(
    "liked"
  );
  const handleEditProfile = (formData: EditFormData) => {
    console.log(formData);
    setIsEditModalOpen(false);
  };

  //TODO - Practice data -> later with real posts
  const likedPosts: any[] = [];
  const repostedPosts: any[] = [];

  //TODO -> add 3 more sections -> your posts, likes, reposts
  //TODO -> followers

  return (
    <div className="profile-container">
      <div className="profile-cover">
        <img
          src={user?.profile?.coverImage || DEFAULT_IMAGES.cover}
          alt="Cover"
        />
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-picture">
            <img
              src={user?.profile?.profileImage || DEFAULT_IMAGES.profile}
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <div className="name-section">
              <h1>{`${user?.profile?.firstName} ${user?.profile?.lastName}`}</h1>
              <button
                className="dropdown-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {isDropdownOpen ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                  <button className="delete-button">
                    <Trash2 size={16} />
                    Delete Profile
                  </button>
                </div>
              )}
            </div>
            <span className="profile-role">
              {user?.userRole
                ? user.userRole.charAt(0).toUpperCase() + user.userRole.slice(1)
                : ""}
            </span>
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
              <span>{user?.userRole}</span>
            </div>
            <div className="detail-item">
              <strong>Member since:</strong>
              <span>
                {user?.createdAt
                  ? new Date(user?.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <div className="detail-item">
              <strong>Skills:</strong>
              <span>
                {user?.profile?.skills?.length
                  ? user.profile.skills
                      .map(
                        (skill) =>
                          `${skill.skill.name} - ${skill.proficiencyLevel}`
                      )
                      .join(", ")
                  : "No entered skills"}
              </span>
            </div>
            <div className="detail-item">
              <strong>Contacts:</strong>
              <span>
                {user?.profile?.contacts && user.profile.contacts.length > 0 ? (
                  user.profile.contacts
                    .map((contact) => contact.value)
                    .join(", ")
                ) : (
                  <div>No entered contacts</div>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="posts-navigation">
          <button
            className={`posts-nav-button ${
              activeSection === "liked" ? "active" : ""
            }`}
            onClick={() => setActiveSection("liked")}
          >
            <Heart size={20} />
            Liked Posts
          </button>
          <button
            className={`posts-nav-button ${
              activeSection === "reposted" ? "active" : ""
            }`}
            onClick={() => setActiveSection("reposted")}
          >
            <Repeat size={20} />
            Reposted
          </button>
        </div>

        <div
          className={`posts-section ${
            activeSection === "liked" ? "active" : ""
          }`}
        >
          {likedPosts.length > 0 ? (
            <div className="profile-posts">
              {likedPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-posts">
              <HeartOff size={48} />
              <p>No liked posts yet</p>
            </div>
          )}
        </div>

        <div
          className={`posts-section ${
            activeSection === "reposted" ? "active" : ""
          }`}
        >
          {repostedPosts.length > 0 ? (
            <div className="profile-posts">
              {repostedPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-posts">
              <RepeatOff size={48} />
              <p>No reposted posts yet</p>
            </div>
          )}
        </div>
      </div>

      <EditProfile
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditProfile}
        initialData={{
          email: user?.email || "",
          firstName: user?.profile?.firstName || "",
          lastName: user?.profile?.lastName || "",
        }}
      />
    </div>
  );
}
