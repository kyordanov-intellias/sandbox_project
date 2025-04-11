import { Heart, MessageCircle, Repeat2, Flag } from "lucide-react";
import { Post } from "../../../interfaces/postsInterfaces";
import { useUser } from "../../../context/UserContext";

interface PostActionsProps {
  post: Post;
  isLiking: boolean;
  isReposting: boolean;
  onLike: (e: React.MouseEvent) => void;
  onRepost: (e: React.MouseEvent) => void;
  onMark: (e: React.MouseEvent) => void;
}

export function PostActions({
  post,
  isLiking,
  isReposting,
  onLike,
  onRepost,
  onMark,
}: PostActionsProps) {
  const { user } = useUser();

  return (
    <div className="post-card-actions">
      <button
        className={`post-card-action-button ${
          post.isLikedByUser ? "liked" : ""
        }`}
        onClick={onLike}
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

      <button
        className={`post-card-action-button ${
          post.isRepostedByUser ? "reposted" : ""
        }`}
        onClick={onRepost}
        disabled={!user || isReposting}
      >
        <Repeat2
          size={20}
          className={
            post.isRepostedByUser ? "repost-icon reposted" : "repost-icon"
          }
        />
        <span>{post.repostsCount}</span>
      </button>

      {user?.userRole === "administrator" && (
        <button
          className={`post-card-action-button ${
            post.isMarkedByAdmin ? "marked" : ""
          }`}
          onClick={onMark}
        >
          <Flag size={20} />
          <span>{post.isMarkedByAdmin ? "Marked" : "Mark"}</span>
        </button>
      )}
    </div>
  );
}
