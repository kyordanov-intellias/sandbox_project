import { useState } from "react";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import type { Post } from "../types";
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
            src={post.author.avatar}
            alt={post.author.name}
            className="post-card-avatar"
          />
          <div className="group relative">
            <div className="post-card-author-name">{post.author.name}</div>
            <div className="hidden group-hover:block">
              <UserHoverCard user={post.author} />
            </div>
          </div>
        </div>

        {/* Post Content */}
        <p className="post-card-content">{post.content}</p>

        {/* Post Image */}
        {post.image && (
          <img
            src={post.image}
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
            <span>{post.likes}</span>
          </button>

          <button className="post-card-action-button comment-button">
            <MessageCircle size={20} />
            <span>{post.comments.length}</span>
          </button>

          <button className="post-card-action-button repost-button">
            <Repeat2 size={20} />
            <span>{post.reposts}</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <PostModal post={post} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
