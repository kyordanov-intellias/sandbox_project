import { PostCard } from "./PostCard/PostCard.components";
import { Post } from "./types";

export function Posts() {

  const mockPosts: Post[] = [
    {
      id: "1",
      content: "Just finished a great coding session! 🚀 #coding #webdev",
      image: "https://picsum.photos/800/600",
      author: {
        id: "user1",
        name: "Sarah Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "participant"
      },
      likes: 42,
      comments: [
        {
          id: "c1",
          content: "Great work! Keep it up! 💪",
          user: {
            id: "user2",
            name: "John Mentor",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            role: "mentor"
          },
          createdAt: "2024-03-21T10:30:00Z"
        }
      ],
      reposts: 5,
      createdAt: "2024-03-21T09:00:00Z"
    },
    {
      id: "2",
      content: "Learning React and TypeScript - mind blown! 🤯",
      author: {
        id: "user3",
        name: "Alex Learner",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        role: "participant"
      },
      likes: 28,
      comments: [],
      reposts: 2,
      createdAt: "2024-03-21T08:15:00Z"
    }
  ];

  return (
    <div style={{
      width: "70%",
      margin: "0px auto",
      display: "flex",
      flexDirection: "column",
      gap: "3rem"
    }}>
{
  mockPosts.map((post) => (
    <PostCard key={post.id} post={post} />
  ))
}
    </div >
  );
}
