import { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";
import "./Profile.styles.css";
import { useUser } from "../../context/UserContext";
import { EditProfile } from "./Edit-Profile/EditProfile.component";
import { EditFormData } from "../../interfaces/userInterfaces";

export const Profile = () => {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditProfile = (formData: EditFormData) => {
    console.log(formData);
    setIsEditModalOpen(false);
  };

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
            <div className="name-section">
              <h1>{`${user?.profile?.first_name} ${user?.profile?.last_name}`}</h1>
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
                          `${skill.skill.name} - ${skill.proficiency_level}`
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

        <div className="profile-section">
          <h2>You shared your opinion on</h2>
          <div className="profile-posts">
            <div className="post-card">
              <h3>Post Title 1</h3>
              <p>Your comment: "This is a great perspective on the topic..."</p>
            </div>
            <div className="post-card">
              <h3>Post Title 2</h3>
              <p>Your comment: "I completely agree with this analysis..."</p>
            </div>
          </div>
        </div>
      </div>

      <EditProfile
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditProfile}
        initialData={{
          email: user?.email || "",
          firstName: user?.profile?.first_name || "",
          lastName: user?.profile?.last_name || "",
        }}
      />
    </div>
  );
};
