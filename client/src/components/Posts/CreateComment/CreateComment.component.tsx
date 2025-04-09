import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { Post } from "../../../interfaces/postsInterfaces";
import "./CreateComment.styles.css";
import { commentPost } from "../../../services/postService";

interface CreateCommentProps {
  post: Post;
  onCommentCreated: () => void;
}

export function CreateComment({ post, onCommentCreated }: CreateCommentProps) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return <div className="login-prompt">Please log in to comment</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError(null); 
    try {
      setIsSubmitting(true);
      const response = await commentPost(content, post, user);
      if (!response.ok) {
        throw new Error("Failed to create comment");
      }
      setContent("");
      onCommentCreated();
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="comment-input-container">
        <img
          src={user.profile?.profileImage}
          alt={`${user.profile?.firstName}'s avatar`}
          className="comment-avatar"
        />
        <div className="comment-textarea-wrapper">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Write a comment..."
            className="comment-textarea"
            rows={2}
          />
          {error && <div className="comment-error">{error}</div>}
        </div>
      </div>
      <div className="comment-button-container">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="comment-submit-button"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
