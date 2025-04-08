import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { Post } from "../../../interfaces/postsInterfaces";
import { PostModal } from "../PostModal/PostModal.component";
import { useUser } from "../../../context/UserContext";
import { deletePost, markPost } from "../../../services/postService";
import Swal from "sweetalert2";
import "./PostCard.styles.css";

interface PostCardProps {
  post: Post;
  onPostUpdate: (updatedPost: Post) => void;
  fetchPosts: () => void;
}

export function PostCard({ post, onPostUpdate, fetchPosts }: PostCardProps) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isLiking) return;

    try {
      setIsLiking(true);
      const action = post.isLikedByUser ? "dislike" : "like";
      const response = await fetch(
        `http://localhost:4000/posts/${post.id}/${action}?userId=${user.id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like status");
      }

      const updatedPost = await response.json();
      onPostUpdate(updatedPost);
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleMark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || user.userRole !== "administrator") return;
    try {
      const response = await markPost(post.id);
      if (!response.ok) throw new Error("Failed to update mark status");
      const updatedPost: Post = await response.json();
      onPostUpdate(updatedPost);
    } catch (error) {
      console.error("Error marking post:", error);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Post?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePost(post.id);
        if (!response.ok) throw new Error("Failed to delete post");
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        Swal.fire("Oops!", "Something went wrong while deleting.", "error");
      }
    }
  };

  return (
    <>
      <div className="post-card-wrapper">
        <div className="post-card" onClick={() => setIsModalOpen(true)}>
          <div className="post-card-author">
            <img
              src={post.authorInfo.profileImage}
              alt={`${post.authorInfo.firstName}'s avatar`}
              className="post-card-avatar"
            />
            <Link
              to={`/profile/${post.authorId}`}
              className="post-card-author-name"
              onClick={(e) => e.stopPropagation()}
            >
              {post.authorInfo.firstName} {post.authorInfo.lastName}
            </Link>
          </div>

          {user?.id === post.authorId && (
            <div
              className="post-options-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="post-options-button"
                onClick={() => setShowOptions(!showOptions)}
              >
                ⋯
              </button>
              {showOptions && (
                <div className="post-options-menu">
                  <button
                    className="post-options-item"
                    onClick={() => {
                      setIsModalOpen(true);
                      setShowOptions(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="post-options-item delete"
                    onClick={() => {
                      setShowOptions(false);
                      handleDelete();
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="post-card-content">{post.content}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post content"
              className="post-card-image"
            />
          )}

          <div className="post-card-actions">
            <button
              className={`post-card-action-button ${
                post.isLikedByUser ? "liked" : ""
              }`}
              onClick={handleLike}
              disabled={!user || isLiking}
            >
              <Heart
                size={20}
                className={
                  post.isLikedByUser ? "heart-icon liked" : "heart-icon"
                }
                fill={post.isLikedByUser ? "currentColor" : "none"}
              />
              <span>{post.likesCount}</span>
            </button>

            <button className="post-card-action-button comment-button">
              <MessageCircle size={20} />
              <span>{post.comments.length}</span>
            </button>

            <button className="post-card-action-button repost-button">
              <Repeat2 size={20} />
              <span>{post.repostsCount}</span>
            </button>

            {user?.userRole === "administrator" && (
              <button
                className={`post-card-action-button ${
                  post.isMarkedByAdmin ? "marked" : ""
                }`}
                onClick={handleMark}
              >
                <Flag size={20} />
                <span>{post.isMarkedByAdmin ? "Marked" : "Mark"}</span>
              </button>
            )}
          </div>
        </div>

        {isModalOpen && (
          <PostModal
            post={post}
            onClose={() => setIsModalOpen(false)}
            fetchPosts={fetchPosts}
          />
        )}
      </div>
    </>
  );
}
