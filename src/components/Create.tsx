import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostType } from "../types/posts.types";
import { useState } from "react";

const createPosts = async (newPost: Omit<PostType, "id" | "userId">) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

export default function Create() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (newPost: Omit<PostType, "userId" | "id">) =>
      createPosts(newPost),
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value BEFORE updating
      const previousPosts = queryClient.getQueryData<PostType[]>(["posts"]);

      // Optimistically update to the new value
      queryClient.setQueryData<PostType[]>(["posts"], (prev) => [
        ...(prev || []),
        {
          id: Date.now(),
          userId: 1,
          ...newPost,
        } as PostType,
      ]);

      // Return context with the snapshotted value
      return { previousPosts };
    },
    onError: (_error, _newPost, context) => {
      // Or, (_, __, context), if you don't want to use it
      // Roll back to the previous value on error
      if (context?.previousPosts !== undefined) {
        queryClient.setQueryData<PostType[]>(["posts"], context.previousPosts);
      }
    },
    onSuccess: () => {
      // Refetch to get the real data from server
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setTitle(""); // Clear input on success
    },
  });

  const handleClick = () => {
    if (!title.trim()) return alert("Please enter post title");
    mutate({
      title: title.trim(),
      body: "This is another title using react query",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          name="post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a new posts..."
          disabled={isPending}
          className="flex-1 px-4 py-2 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleClick}
          disabled={isPending || !title.trim()}
          className="px-6 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>

      {isError && (
        <div className="mt-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          Error Occurred: {error?.message}
        </div>
      )}
    </div>
  );
}
