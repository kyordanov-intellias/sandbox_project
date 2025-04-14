import { useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Post } from "../../../interfaces/postsInterfaces";
import { CreateComment } from "../CreateComment/CreateComment.component";
import "./PostModal.styles.css";
import { CommentActions } from "./CommentAction/CommentAction.component";
import { useUser } from "../../../context/UserContext";
import { usePosts } from "../../../context/PostContext";
import { deleteCommentById, editCommentById, getPostById } from "../../../services/postService";

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

interface EditingComment {
  id: string;
  content: string;
}

export function PostModal({ post, onClose }: PostModalProps) {
  const [currentPost, setCurrentPost] = useState(post);
  const [editingComment, setEditingComment] = useState<EditingComment | null>(
    null
  );
  const { user } = useUser();
  const { updatePostInContext } = usePosts();

  const sortedComments = [...currentPost.comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const refreshPost = async () => {
    try {
      const response = await getPostById(post.id);
      if (!response.ok) throw new Error("Failed to fetch updated post");
      const updatedPost = await response.json();
      setCurrentPost(updatedPost);
      updatePostInContext(updatedPost);
    } catch (error) {
      console.error("Error fetching updated post:", error);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      const response = await editCommentById(commentId, newContent);
      if (!response.ok) throw new Error("Failed to update comment");
      await refreshPost();
      setEditingComment(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteCommentById(commentId);
      if (!response.ok) throw new Error("Failed to delete comment");
      await refreshPost();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        {currentPost.imageUrl && (
          <div className="modal-image-container">
            <img
              src={currentPost.imageUrl}
              alt="Post content"
              className="modal-image"
            />
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
              {currentPost.authorInfo.firstName}{" "}
              {currentPost.authorInfo.lastName}
            </Link>
          </div>

          <p className="modal-text">{currentPost.content}</p>

          <CreateComment post={currentPost} onCommentCreated={refreshPost} />

          <div className="modal-comments">
            <h3 className="modal-comments-title">Comments</h3>
            {sortedComments.length > 0 ? (
              sortedComments.map((comment) => (
                <div key={comment.id} className="comment-container">
                  <img
                    src={comment.authorInfo.profileImage}
                    alt={`${comment.authorInfo.firstName}'s avatar`}
                    className="comment-avatar"
                  />
                  <div className="comment-content-wrapper">
                    <div className="comment-header">
                      <Link
                        to={`/profile/${comment.authorId}`}
                        className="comment-author-name"
                      >
                        {comment.authorInfo.firstName}{" "}
                        {comment.authorInfo.lastName}
                      </Link>
                      <CommentActions
                        isAuthor={user?.id === comment.authorId}
                        isAdmin={user?.userRole === "administrator"}
                        onEdit={() =>
                          setEditingComment({
                            id: comment.id,
                            content: comment.content,
                          })
                        }
                        onDelete={() => handleDeleteComment(comment.id)}
                      />
                    </div>
                    {editingComment?.id === comment.id ? (
                      <div className="edit-comment-form">
                        <textarea
                          value={editingComment.content}
                          onChange={(e) =>
                            setEditingComment({
                              ...editingComment,
                              content: e.target.value,
                            })
                          }
                        />
                        <div className="edit-comment-buttons">
                          <button
                            onClick={() =>
                              handleEditComment(
                                comment.id,
                                editingComment.content
                              )
                            }
                            className="edit-save-button"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingComment(null)}
                            className="edit-cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="comment-content">{comment.content}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>No comments yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
