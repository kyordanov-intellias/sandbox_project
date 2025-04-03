export const getAllPosts = async () => {
  const response = await fetch(`http://localhost:4000/posts`, {
    method: "GET",
    credentials: "include",
  });

  return response;
};
