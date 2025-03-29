import { X } from 'lucide-react';
import { Post} from '../../../interfaces/postsInterfaces';
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
        {post.imageUrl && (
          <div className="modal-image-container">
            <img
              src={post.imageUrl}
              alt="Post content"
              className="modal-image"
            />
          </div>
        )}

        {/* Content Section */}
        <div className={`modal-content ${!post.authorId ? 'w-full' : ''}`}>
          <button
            onClick={onClose}
            className="modal-close-button"
          >
            <X size={24} />
          </button>

          {/* Author Info */}
          <div className="modal-author">
            <img
              src={post.authorId}
              alt={post.authorId}
              className="modal-author-avatar"
            />
            <div className="group relative">
              <div className="modal-author-name">
                {post.authorId}
              </div>
              <div className="hidden group-hover:block">
                <UserHoverCard user={post.authorId} />
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
                  src={comment.authorId}
                  alt={comment.authorId}
                  className="comment-avatar"
                />
                <div>
                  <div className="group relative inline-block">
                    <span className="comment-author-name">
                      {comment.authorId}
                    </span>
                    <div className="hidden group-hover:block">
                      <UserHoverCard user={comment.authorId} />
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