import { useQuery } from "@tanstack/react-query";
import type { PostType } from "../types/posts.types";

const fetchPosts = async (): Promise<PostType[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");

  if (!response.ok) {
    throw new Error("Error fetching posts");
  }

  return response.json();
};

export default function Posts() {
  const { data, isLoading, isError, error, isFetching } = useQuery<PostType[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 10000,
    retry: 2, // Retry failed requests 2 times
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-500 text-sm">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <p className="text-red-600 font-semibold">Error occurred</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-gray-500 text-sm">No posts found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 relative">
      {isFetching && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
          Updating...
        </div>
      )}

      {data.map((post: PostType) => (
        <div
          key={post.id}
          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <h3 className="text-gray-800 font-medium mb-1">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{post.body}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span>Post ID: {post.id}</span>
            <span>User ID: {post.userId}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
