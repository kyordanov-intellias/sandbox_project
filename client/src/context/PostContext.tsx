import { createContext, useContext, useEffect, useState } from "react";
import { Post, CreatePostResponce } from "../interfaces/postsInterfaces";
import { useUser } from "./UserContext";

interface PostContextType {
  posts: Post[] | null;
  loading: boolean;
  fetchPosts: () => Promise<void>;
  addPost: (newPost: CreatePostResponce) => void;
  updatePostInContext: (updatedPost: Post) => void;
  deletePostById: (postId: string) => void;
  likedPosts: Post[] | null;
  repostedPosts: Post[] | null;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [repostedPosts, setRepostedPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/posts?userId=${user.id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const addPost = (newPost: CreatePostResponce) => {
    setPosts((prev) => (prev ? [newPost, ...prev] : [newPost]));
  };

  const updatePostInContext = (updatedPost: Post) => {
    setPosts((prev) =>
      prev?.map((p) => {
        if (p.id === updatedPost.id) {
          return {
            ...p,
            ...updatedPost,
            isLikedByUser: updatedPost.isLikedByUser ?? p.isLikedByUser,
            isRepostedByUser: updatedPost.isRepostedByUser ?? p.isRepostedByUser,
            isMarkedByAdmin: updatedPost.isMarkedByAdmin ?? p.isMarkedByAdmin,
          };
        }
        return p;
      }) || null
    );

    setLikedPosts((prev) =>
      updatedPost.isLikedByUser
        ? prev.some((p) => p.id === updatedPost.id)
          ? prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          : [...prev, updatedPost]
        : prev.filter((p) => p.id !== updatedPost.id)
    );

    setRepostedPosts((prev) =>
      updatedPost.isRepostedByUser
        ? prev.some((p) => p.id === updatedPost.id)
          ? prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          : [...prev, updatedPost]
        : prev.filter((p) => p.id !== updatedPost.id)
    );
  };

  const deletePostById = (postId: string) => {
    setPosts((prev) => prev?.filter((p) => p.id !== postId) || null);
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        addPost,
        updatePostInContext,
        deletePostById,
        likedPosts,
        repostedPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
