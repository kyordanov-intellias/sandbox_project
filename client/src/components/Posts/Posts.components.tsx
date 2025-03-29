import { usePosts } from "../../context/PostsContext";
import { PostCard } from "./PostCard/PostCard.components";

export default function Posts() {
  const { posts } = usePosts();
  console.log(posts);

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
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div>No posts yet</div>
      )}
    </div>
  );
}
