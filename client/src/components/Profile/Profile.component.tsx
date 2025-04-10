import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Heart,
  Repeat,
  HeartOff,
  Repeat as RepeatOff,
  UserPlus,
  UserMinus,
} from "lucide-react";
import "./Profile.styles.css";
import { useUser } from "../../context/UserContext";
import { EditProfile } from "./Edit-Profile/EditProfile.component";
import { EditFormData } from "../../interfaces/userInterfaces";
import { DEFAULT_IMAGES } from "../Register/defaultImages";
import { getUserById } from "../../services/userServices";
import { UserProfileInterface } from "../../interfaces/userInterfaces";

export default function Profile() {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<UserProfileInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<"liked" | "reposted">(
    "liked"
  );
  const { user: currentUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.id === profileId;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isOwnProfile && currentUser?.profile) {
          setProfile({
            id: currentUser.profile.id,
            authId: currentUser.profile.authId || currentUser.id,
            email: currentUser.profile.email,
            firstName: currentUser.profile.firstName,
            lastName: currentUser.profile.lastName,
            userRole: currentUser.profile.userRole,
            profileImage: currentUser.profile.profileImage || "",
            coverImage: currentUser.profile.coverImage || "",
            skills: currentUser.profile.skills,
            contacts: currentUser.profile.contacts
          });
          setLoading(false);
          return;
        }

        const response = await getUserById(profileId || "");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await response.json();
        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    }
  }, [profileId, currentUser, isOwnProfile]);

  const handleEditProfile = (formData: EditFormData) => {
    console.log(formData);
    setIsEditModalOpen(false);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow the user
  };

  //TODO - Practice data -> later with real posts
  const likedPosts: Array<{id: string; title: string; content: string; createdAt: string}> = [];
  const repostedPosts: Array<{id: string; title: string; content: string; createdAt: string}> = [];

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div className="error">Profile not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-cover">
        <img
          src={profile.coverImage || DEFAULT_IMAGES.cover}
          alt="Cover"
        />
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-picture">
            <img
              src={profile.profileImage || DEFAULT_IMAGES.profile}
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <div className="name-section">
              <h1>{`${profile.firstName} ${profile.lastName}`}</h1>
              {isOwnProfile ? (
                <>
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
                </>
              ) : currentUser ? (
                <button
                  className={`follow-button ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus size={18} />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Follow
                    </>
                  )}
                </button>
              ) : null}
            </div>
            <span className="profile-role">
              {profile.userRole
                ? profile.userRole.charAt(0).toUpperCase() + profile.userRole.slice(1)
                : ""}
            </span>
          </div>
        </div>

        <div className="profile-section">
          <h2>About</h2>
          <div className="profile-details">
            <div className="detail-item">
              <strong>Email:</strong>
              <span>{profile.email}</span>
            </div>
            <div className="detail-item">
              <strong>Role:</strong>
              <span>{profile.userRole}</span>
            </div>
            <div className="detail-item skills-container">
              <strong>Skills:</strong>
              <div className="skills-list">
                {profile.skills?.length ? (
                  profile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      <span className="skill-name">{skill.skill.name}</span>
                      <span className="skill-level">
                        {skill.proficiencyLevel}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="no-data">No entered skills</span>
                )}
              </div>
            </div>
            <div className="detail-item contacts-container">
              <strong>Contacts:</strong>
              <div className="contacts-list">
                {profile.contacts && profile.contacts.length > 0 ? (
                  profile.contacts.map((contact, index) => (
                    <span key={index} className="contact-item">
                      {contact.value}
                    </span>
                  ))
                ) : (
                  <span className="no-data">No entered contacts</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <>
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
          </>
        )}
      </div>

      {isOwnProfile && (
        <EditProfile
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProfile}
          initialData={{
            email: profile.email || "",
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
          }}
        />
      )}
    </div>
  );
}
