import React, { createContext, useState, useEffect, useContext } from "react";
import { Post, Comment} from "../interfaces/postsInterfaces";
import { getAllPosts } from "../services/postService";

interface PostsContextType {
  posts: Post[] | null;
  loading: boolean;
  fetchPosts: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Array<Post> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsResponse = await getAllPosts();
      
      if (!postsResponse.ok) {
        setPosts(null);
        return;
      }
  
      const postsData: Post[] = await postsResponse.json();
  
      const postsWithComments = await Promise.all(
        postsData.map(async (post) => {
          try {
            const commentsResponse = await fetch(
              `http://localhost:4000/posts/${post.id}/comments`
            );
            if (!commentsResponse.ok) {
              throw new Error(`Failed to fetch comments for post ${post.id}`);
            }
            const comments: Comment[] = await commentsResponse.json();
            return { ...post, comments };
          } catch (error) {
            console.error("Error fetching comments:", (error as Error).message);
            return { ...post, comments: [] };
          }
        })
      );
  
      setPosts(postsWithComments);
    } catch (error) {
      console.error("Error fetching posts:", (error as Error).message);
      setPosts(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  //TODO useCallback

  return (
    <PostsContext.Provider value={{ posts, loading, fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
