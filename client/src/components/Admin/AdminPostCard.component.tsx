import { Post } from "../../interfaces/postsInterfaces";
import { Trash2 } from "lucide-react";

interface Props {
  post: Post;
  onMenuClick: (post: Post) => void;
}

export default function AdminPostCard({ post, onMenuClick }: Props) {
  return (
    <div className="admin-post-card">
      <div className="admin-post-header">
        <div className="admin-author">
          <img
            src={post.authorInfo.profileImage || "/default-avatar.png"}
            alt="Author"
            className="admin-author-avatar"
          />
          <div className="admin-author-details">
            <div className="admin-author-name">
              {post.authorInfo.firstName} {post.authorInfo.lastName}
            </div>
            <div className="admin-post-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <button className="admin-menu-button" onClick={() => onMenuClick(post)}>
          <Trash2 />
        </button>
      </div>

      <div className="admin-post-body">
        <p className="admin-post-content">{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post" className="admin-post-image" />
        )}
      </div>
    </div>
  );
}
