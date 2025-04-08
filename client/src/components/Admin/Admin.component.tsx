import { useEffect, useState } from "react";
import { Post } from "../../interfaces/postsInterfaces";
import { deletePost, getAllPosts } from "../../services/postService";
import AdminPostCard from "./AdminPostCard.component";
import "./Admin.styles.css";

export default function Admin() {
  const [posts, setPosts] = useState<Post[] | null>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getAllPosts();
      const data: Post[] = await response.json();
      data.map((el) => {
        return {
          ...el,
          isMarkedByAdmin: false,
        };
      });
      console.log(data);

      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleMenuClick = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (selectedPost) {
      const responce = await deletePost(selectedPost.id);
      if (responce.ok) {
        setPosts((prev) => prev?.filter((p) => p.id !== selectedPost.id) || []);
        setShowModal(false);
      } else {
        console.log(`Something went wrog -> ${responce}`);
      }
    }
  };

  const markedPosts = posts?.filter((post) => (post as Post).isMarkedByAdmin);
  const otherPosts = posts?.filter((post) => !(post as Post).isMarkedByAdmin);

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Admin Panel</h2>

      {markedPosts && markedPosts.length > 0 && (
        <>
          <h3 className="section-title">Marked Posts</h3>
          <div className="posts-grid">
            {markedPosts.map((post) => (
              <AdminPostCard
                key={post.id}
                post={post}
                onMenuClick={handleMenuClick}
              />
            ))}
          </div>
        </>
      )}

      <h3 className="section-title">All Posts</h3>
      <div className="posts-grid">
        {otherPosts?.map((post) => (
          <AdminPostCard
            key={post.id}
            post={post}
            onMenuClick={handleMenuClick}
          />
        ))}
      </div>

      {showModal && selectedPost && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h4>Delete Post</h4>
            <p>Are you sure you want to delete this post?</p>
            <div className="modal-buttons">
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
