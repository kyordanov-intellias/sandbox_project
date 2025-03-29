import { useState } from "react";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { Post } from "../../../interfaces/postsInterfaces";
import { PostModal } from "../PostModal/PostModal.component";
import { UserHoverCard } from "../UserHoverCard/UserHoverCard.component";
import "./PostCard.styles.css";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <>
      <div className="post-card" onClick={() => setIsModalOpen(true)}>
        {/* Author Info */}
        <div className="post-card-author">
          <img
            src={post.authorId}
            alt={post.authorId}
            className="post-card-avatar"
          />
          <div className="group relative">
            <div className="post-card-author-name">{post.authorId}</div>
            <div className="hidden group-hover:block">
              <UserHoverCard user={post.authorId} />
            </div>
          </div>
        </div>

        {/* Post Content */}
        <p className="post-card-content">{post.content}</p>

        {/* Post Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="post-card-image"
          />
        )}

        {/* Interaction Buttons */}
        <div className="post-card-actions">
          <button
            className="post-card-action-button like-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart
              size={20}
              className={isLiked ? "fill-red-500 text-red-500" : ""}
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
        <PostModal post={post} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
