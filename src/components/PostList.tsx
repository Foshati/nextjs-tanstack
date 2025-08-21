"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface NewPost {
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  return res.data;
};

const createPost = async (newPost: NewPost): Promise<Post> => {
  const res = await axios.post("https://jsonplaceholder.typicode.com/posts", newPost);
  return res.data;
};

export default function PostList() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Posts</h1>
      <button
        type="button"
        onClick={() => mutation.mutate({ title: "New Post", body: "Hello World!" })}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Post
      </button>
      <ul className="mt-4 space-y-2">
        {posts?.slice(0, 10).map((post: Post) => (
          <li key={post.id} className="p-2 border rounded">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
