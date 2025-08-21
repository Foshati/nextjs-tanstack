"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }, () => crypto.randomUUID()).map((id) => (
          <Card key={id}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button
          type="button"
          onClick={() => mutation.mutate({ title: "New Post", body: "Hello World!" })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Post
        </button>
      </div>
      <div className="space-y-4">
        {posts?.slice(0, 10).map((post: Post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{post.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

