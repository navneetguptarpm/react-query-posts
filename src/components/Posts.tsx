import { useQuery } from "@tanstack/react-query";
import type { PostType } from "../types/posts.types";

const fetchPosts = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) {
    throw new Error("Error fetching posts");
  }
  return response.json();
};

export default function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 10000,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </div>
    );

  if (error instanceof Error)
    return (
      <div className="flex items-center justify-center">
        <span className="text-red-500">{`Error occurred: ${error.message}`}</span>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex items-center justify-center">
        <span className="text-gray-500">No posts found.</span>
      </div>
    );

  return (
    <div className="space-y-2">
      {data.map((post: PostType) => (
        <div
          key={post.id}
          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-gray-700">{post.title}</span>
        </div>
      ))}
    </div>
  );
}
