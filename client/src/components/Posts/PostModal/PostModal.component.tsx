import { X } from 'lucide-react';
import type { Post } from '../types';
import { UserHoverCard } from '../UserHoverCard/UserHoverCard.component';
import './PostModal.styles.css';

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  return (
    <div className="modal-overlay">
      <div
        className="modal-backdrop"
        onClick={onClose}
      />
      <div className="modal-container">
        {/* Image Section */}
        {post.image && (
          <div className="modal-image-container">
            <img
              src={post.image}
              alt="Post content"
              className="modal-image"
            />
          </div>
        )}

        {/* Content Section */}
        <div className={`modal-content ${!post.image ? 'w-full' : ''}`}>
          <button
            onClick={onClose}
            className="modal-close-button"
          >
            <X size={24} />
          </button>

          {/* Author Info */}
          <div className="modal-author">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="modal-author-avatar"
            />
            <div className="group relative">
              <div className="modal-author-name">
                {post.author.name}
              </div>
              <div className="hidden group-hover:block">
                <UserHoverCard user={post.author} />
              </div>
            </div>
          </div>

          {/* Post Content */}
          <p className="modal-text">{post.content}</p>

          {/* Comments Section */}
          <div className="modal-comments">
            <h3 className="modal-comments-title">Comments</h3>
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment-container">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="comment-avatar"
                />
                <div>
                  <div className="group relative inline-block">
                    <span className="comment-author-name">
                      {comment.user.name}
                    </span>
                    <div className="hidden group-hover:block">
                      <UserHoverCard user={comment.user} />
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}