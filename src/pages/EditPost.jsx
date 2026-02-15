import { useEffect, useState } from "react";
import { Container, PostForm } from "../../src/components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams, Link } from "react-router-dom";
  function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { slug } = useParams();
  const navigate = useNavigate();
useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!slug) return navigate("/");

        const data = await appwriteService.getPost(slug);
        if (!data) throw new Error("Post not found");

        setPost(data);
      } catch (err) {
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <Container>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-blue-600">Home</Link> /
          <Link to="/all-posts" className="mx-1 hover:text-blue-600">Posts</Link> /
          <span className="text-gray-700 font-medium">Edit</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Edit Post ✏️
            </h1>
            <p className="text-gray-500 text-sm">
              Modify your content and update your post
            </p>
          </div>

          {post && (
            <Link
              to={`/post/${post.$id}`}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View Post →
            </Link>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="h-96 rounded-2xl bg-gray-200 animate-pulse"></div>
        )}

        {/* Form */}
        {!loading && post && (
          <div className="bg-white shadow-xl rounded-2xl p-6 border transition-all">
           <PostForm post={post} />
          </div>
        )}

      </Container>
      </div>
  );
 }
export default EditPost;
