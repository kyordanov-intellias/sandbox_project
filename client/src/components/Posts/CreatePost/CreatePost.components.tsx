import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { usePosts } from "../../../context/PostContext.tsx";
import { Plus } from "lucide-react";
import "./CreatePost.styles.css";
import { useNavigate } from "react-router-dom";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import { CreatePostRequest } from "../../../interfaces/postsInterfaces.ts";

export default function CreatePost() {
  const { user, logout } = useUser();
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    uploading: uploadingImage,
    error: imageError,
    uploadImage,
  } = useCloudinaryUpload();

  const handleAuthError = async () => {
    await logout();
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newPost: CreatePostRequest = {
      content,
      imageUrl: imageUrl || undefined,
      authorId: user.id,
      authorInfo: {
        firstName: user.profile!.firstName,
        lastName: user.profile!.lastName,
        profileImage: user.profile!.profileImage,
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
      addPost(createdPost);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      setImageUrl(uploadedUrl);
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

              <div className="image-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                {imageUrl && (
                  <div className="image-preview post-image-preview">
                    <img src={imageUrl} alt="Post preview" />
                  </div>
                )}
                {uploadingImage && (
                  <div className="upload-status">Uploading...</div>
                )}
                {imageError && (
                  <div className="error-message">{imageError}</div>
                )}
              </div>

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
                  disabled={loading || uploadingImage}
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
