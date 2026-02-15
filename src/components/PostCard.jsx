import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
function PostCard({ $id, title, featuredImage, userId, authorName }) {
  
  const imageUrl = featuredImage
    ? appwriteService.getFilePreview(featuredImage)
    : "https://via.placeholder.com/600x400?text=No+Image";

  // Short userId for clean UI
  const shortUserId = userId
    ? `${userId.slice(0, 8)}...${userId.slice(-4)}`
    : "Unknown ID";
  return (
      <Link to={`/post/${$id}`} className="group block">
      <div
        className="
          relative overflow-hidden rounded-2xl
          bg-white shadow-md
          transition-all duration-300
          hover:shadow-2xl hover:-translate-y-1
        "
      >
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="
              w-full h-full object-cover
              transition-transform duration-500
              group-hover:scale-110
            "
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80"></div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">

          {/* Title */}
          <h2
            className="
              text-lg font-bold text-gray-800
              line-clamp-2
              group-hover:text-blue-600
              transition
            "
          >
            {title}
          </h2>

          {/* Author Section */}
          <div className="text-sm text-gray-600 border-t pt-3 space-y-2">

            {/* User ID */}
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                {shortUserId}
              </span>
            </div>

            {/* Author Name */}
            <div className="flex items-center gap-2">
              <span>✍️</span>
              <span className="truncate">
                {authorName || "Unknown Author"}
              </span>
            </div>

          </div>

          {/* Underline Animation */}
          <span className="block w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-12"></span>

        </div>

        {/* Shine Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
          <div className="absolute -left-10 top-0 w-32 h-full bg-white/20 blur-2xl rotate-12"></div>
        </div>
          </div>
        </Link>
      );
    }
export default PostCard;
