import { useState } from "react";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Post } from "../../../interfaces/postsInterfaces";
import { PostModal } from "../PostModal/PostModal.component";
import { useUser } from "../../../context/UserContext";
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

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isLiking) return;

    try {
      setIsLiking(true);
      const action = post.isLikedByUser ? 'dislike' : 'like';
      const response = await fetch(
        `http://localhost:4000/posts/${post.id}/${action}?userId=${user.id}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      const updatedPost = await response.json();
      onPostUpdate(updatedPost);
    } catch (error) {
      console.error('Error updating like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <>
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
            className={`post-card-action-button ${post.isLikedByUser ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={!user || isLiking}
          >
            <Heart
              size={20}
              className={post.isLikedByUser ? "heart-icon liked" : "heart-icon"}
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
        </div>
      </div>

      {isModalOpen && (
        <PostModal 
          post={post} 
          onClose={() => setIsModalOpen(false)}
          fetchPosts = {fetchPosts}
        />
      )}
    </>
  );
}
