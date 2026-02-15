import { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await appwriteService.getPosts();
        if (res?.documents) setPosts(res.documents);
      } catch {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">

      {/* HERO SECTION */}
      <section className="py-16 text-center">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Discover & Share Ideas ✨
          </h1>

          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Explore posts from creators around the world. Learn, share,
            and inspire others through your words.
          </p>

          <Link
            to="/add-post"
            className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
          >
            Create Post
          </Link>
        </Container>
      </section>

      {/* POSTS SECTION */}
      <section className="pb-16">
        <Container>

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Latest Posts
            </h2>

            {!loading && (
              <span className="text-sm bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold w-fit">
                {posts.length} Posts
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="text-center text-red-600 mb-6 font-medium">
              {error}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-700">
                No Posts Yet
              </h3>
              <p className="text-gray-500 mt-2">
                Be the first one to publish something 🚀
              </p>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && posts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {posts.map((post) => (
                <div
                  key={post.$id}
                  className="transition transform hover:scale-[1.03] duration-300"
                >
                  {/* <PostCard {...post} /> */}                  
                  <PostCard key={post.$id} {...post} />
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default Home;
