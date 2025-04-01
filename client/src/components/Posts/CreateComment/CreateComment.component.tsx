import { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { Post } from '../../../interfaces/postsInterfaces';
import './CreateComment.styles.css';

interface CreateCommentProps {
    post: Post;
    onCommentCreated: () => void;
}

export function CreateComment({ post, onCommentCreated }: CreateCommentProps) {
    const { user } = useUser();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) {
        return (
            <div className="login-prompt">
                Please log in to comment
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            const response = await fetch(`http://localhost:4000/posts/${post.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: content.trim(),
                    postId: post.id,
                    authorId: user.id,
                    authorInfo: {
                        firstName: user.profile?.firstName,
                        lastName: user.profile?.lastName,
                        profileImage: user.profile?.profileImage,
                        userRole: user.userRole
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create comment');
            }

            setContent('');
            onCommentCreated();
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <div className="comment-input-container">
                <img
                    src={user.profile?.profileImage}
                    alt={`${user.profile?.firstName}'s avatar`}
                    className="comment-avatar"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-textarea"
                    rows={2}
                />
            </div>
            <div className="comment-button-container">
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="comment-submit-button"
                >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
}