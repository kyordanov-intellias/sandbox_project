import { useState } from "react";
import { Post } from "../../../interfaces/postsInterfaces";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import { updatePost } from "../../../services/postService";
import { usePosts } from "../../../context/PostContext";
import "./EditPost.styles.css";

interface EditPostProps {
  post: Post;
  onClose: () => void;
}

export function EditPost({ post, onClose }: EditPostProps) {
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const { updatePostInContext } = usePosts();

  const {
    uploading: uploadingImage,
    error: imageError,
    uploadImage,
  } = useCloudinaryUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await updatePost(post.id, content, imageUrl);

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();
      updatePostInContext(updatedPost);
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
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

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="edit-post-overlay" onClick={handleOverlayClick}>
      <div className="edit-post-container">
        <h2 className="edit-post-title">Edit Post</h2>
        <form onSubmit={handleSubmit} className="edit-post-form">
          <textarea
            className="edit-post-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="edit-post-image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="edit-post-file-input"
            />
            {imageUrl && (
              <div className="edit-post-image-preview">
                <img src={imageUrl} alt="Post preview" />
              </div>
            )}
            {uploadingImage && (
              <div className="edit-post-upload-status">Uploading...</div>
            )}
            {imageError && <div className="edit-post-error">{imageError}</div>}
          </div>

          <div className="edit-post-actions">
            <button
              type="button"
              onClick={onClose}
              className="edit-post-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="edit-post-submit-btn"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
