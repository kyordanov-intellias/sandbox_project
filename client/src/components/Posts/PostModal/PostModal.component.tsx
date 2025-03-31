import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '../../../interfaces/postsInterfaces';
import { CreateComment } from '../CreateComment/CreateComment.component';
import './PostModal.styles.css';

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  const [currentPost, setCurrentPost] = useState(post);

  const sortedComments = [...currentPost.comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleCommentCreated = async () => {
    try {
      const response = await fetch(`http://localhost:4000/posts/${post.id}`);
      if (!response.ok) throw new Error('Failed to fetch updated post');
      const updatedPost = await response.json();
      setCurrentPost(updatedPost);
    } catch (error) {
      console.error('Error fetching updated post:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        
        {currentPost.imageUrl && (
          <div className="modal-image-container">
            <img src={currentPost.imageUrl} alt="Post content" className="modal-image" />
          </div>
        )}

        <div className="modal-content">
          <button onClick={onClose} className="modal-close-button">
            <X size={24} />
          </button>

          <div className="modal-author">
            <img
              src={currentPost.authorInfo.profileImage}
              alt={`${currentPost.authorInfo.firstName}'s avatar`}
              className="modal-author-avatar"
            />
            <Link 
              to={`/profile/${currentPost.authorId}`} 
              className="modal-author-name hover:underline"
            >
              {currentPost.authorInfo.firstName} {currentPost.authorInfo.lastName}
            </Link>
          </div>

          <p className="modal-text">{currentPost.content}</p>

          <CreateComment post={currentPost} onCommentCreated={handleCommentCreated} />

          <div className="modal-comments">
            <h3 className="modal-comments-title">Comments</h3>
            {sortedComments.length > 0 ? sortedComments.map((comment) => (
              <div key={comment.id} className="comment-container">
                <img
                  src={comment.authorInfo.profileImage}
                  alt={`${comment.authorInfo.firstName}'s avatar`}
                  className="comment-avatar"
                />
                <div>
                  <Link 
                    to={`/profile/${comment.authorId}`}
                    className="comment-author-name hover:underline"
                  >
                    {comment.authorInfo.firstName} {comment.authorInfo.lastName}
                  </Link>
                  <p className="comment-content">{comment.content}</p>
                </div>
              </div>
            )) : <div>No comments yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}