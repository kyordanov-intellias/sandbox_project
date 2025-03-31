import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import "./CreatePost.styles.css";

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const createdPost = await response.json();
        onPostCreated(createdPost);
        setContent("");
        setImageUrl("");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (
    !user ||
    (user.userRole !== "mentor" && user.userRole !== "administrator")
  ) {
    return null;
  }

  return (
    <div className="create-post-container">
      <button className="create-post-button" onClick={() => setIsOpen(true)}>
        Create Post
      </button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit} className="post-form">
              <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? "Posting..." : "Post"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="close-button"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
