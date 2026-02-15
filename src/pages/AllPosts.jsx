import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts([]);
        if (response?.documents) {
          setPosts(response.documents);
        }
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <Container>

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Explore Posts
            </h1>
            <p className="text-gray-500 text-sm">
              Discover content shared by the community
            </p>
          </div>

          {/* count badge */}
          <div className="text-sm bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold w-fit">
            {posts.length} Posts
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-60 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Posts Found
            </h2>
            <p className="text-gray-500 mt-2">
              Be the first one to publish something ✨
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="transition transform hover:scale-[1.02]"
              >
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
