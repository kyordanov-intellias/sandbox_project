import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { PostCard } from "./PostCard/PostCard.components";
import { Post } from "../../interfaces/postsInterfaces";
import CreatePost from "./CreatePost/CreatePost.components";
import { MessageSquare } from "lucide-react";

export default function Posts() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/posts${user ? `?userId=${user.id}` : ""}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "70%",
        margin: "0px auto",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
      }}
    >
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPostUpdate={(updatedPost) => {
              setPosts(
                posts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
              );
            }}
            fetchPosts={fetchPosts}
          />
        ))
      ) : (
        <div className="no-posts">
          <MessageSquare className="no-posts-icon" size={48} />
          <p>No posts yet</p>
          
        </div>
      )}

      {user &&
        (user.userRole === "mentor" || user.userRole === "administrator") && (
          <CreatePost onPostCreated={fetchPosts} />
        )}
    </div>
  );
}
