import { MessageSquare } from "lucide-react";
import { usePosts } from "../../context/PostContext.tsx";
import { useUser } from "../../context/UserContext";
import { PostCard } from "./PostCard/PostCard.components";
import CreatePost from "./CreatePost/CreatePost.components";
import "./Posts.styles.css";

export default function Posts() {
  const { posts, loading } = usePosts();
  const { user } = useUser();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="posts-container">
      {posts && posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="no-posts">
          <MessageSquare className="no-posts-icon" size={48} />
          <p>No posts yet</p>
        </div>
      )}

      {user &&
        (user.userRole === "mentor" || user.userRole === "administrator") && (
          <CreatePost />
        )}
    </div>
  );
}
