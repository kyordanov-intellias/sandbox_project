import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { Plus } from "lucide-react";
import "./CreatePost.styles.css";
import { Post } from "../../../interfaces/postsInterfaces";
import { useNavigate } from "react-router-dom";

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthError = async () => {
    await logout();
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newPost = {
      content,
      imageUrl: imageUrl || undefined,
      authorId: user.id,
      authorInfo: {
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        profileImage: user.profile?.profileImage,
        userRole: user.userRole,
      },
    };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.code === "NO_TOKEN" || error.code === "INVALID_TOKEN") {
          handleAuthError();
          return;
        }
        throw new Error(error.message || "Failed to create post");
      }

      const createdPost = await response.json();
      onPostCreated(createdPost);
      setContent("");
      setImageUrl("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  if (
    !user ||
    (user.userRole !== "mentor" && user.userRole !== "administrator")
  ) {
    return null;
  }

  return (
    <>
      <button className="create-post-fab" onClick={() => setIsOpen(true)}>
        <Plus size={24} />
      </button>
      {isOpen && (
        <div className="create-post-modal-overlay" onClick={handleOverlayClick}>
          <div className="create-post-modal-content">
            <h2 className="create-post-modal-title">Create a New Post</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
              <textarea
                className="create-post-textarea"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <input
                className="create-post-input"
                type="text"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="create-post-button-group">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="create-post-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="create-post-submit"
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
