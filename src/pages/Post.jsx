
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../../src/components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  // here start
  const [isFollowing, setIsFollowing] = useState(false);
  const [followDocId, setFollowDocId] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  // here end
  const [commentLikes, setCommentLikes] = useState({});

  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeDocId, setLikeDocId] = useState(null);

  const isAuthor = post && userData ? post.userId === userData.$id : false;
// here do
  useEffect(() => {
    if (!post || !userData) return;

    if (post.userId === userData.$id) return; // can't follow yourself

    const loadFollow = async () => {
      const relation = await appwriteService.getFollowRelation(
      userData.$id,
      post.userId
      );

      if (relation.total > 0) {
      setIsFollowing(true);
      setFollowDocId(relation.documents[0].$id);
      }

      const followers = await appwriteService.getFollowersCount(post.userId);
      setFollowersCount(followers.total);
  };

  loadFollow();
}, [post, userData]);
    const toggleFollow = async () => {
      if (!userData) return;

      if (isFollowing) {
        await appwriteService.unfollowUser(followDocId);
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        const doc = await appwriteService.followUser(userData.$id, post.userId);
        setFollowDocId(doc.$id);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    };



  // 🔹 Fetch Post
    useEffect(() => {
      const fetchPost = async () => {
        if (!slug) return navigate("/");

        try {
          const data = await appwriteService.getPost(slug);
          if (!data) return navigate("/");

          setPost(data);
        } catch (err) {
          console.error(err);
          navigate("/");
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }, [slug, navigate]);

  // 🔹 Fetch Comments

  useEffect(() => {
  if (!post) return;

  const loadComments = async () => {
    const res = await appwriteService.getComments(post.$id);
    const commentsData = res.documents;

    let likesMap = {};

    for (const c of commentsData) {
      const likes = await appwriteService.getCommentLikes(c.$id);

      let liked = false;
      let likeDocId = null;

      if (userData) {
        const userLike = await appwriteService.getUserCommentLike(c.$id, userData.$id);
        if (userLike.total > 0) {
          liked = true;
          likeDocId = userLike.documents[0].$id;
        }
      }

      likesMap[c.$id] = {
        count: likes.total,
        liked,
        likeDocId,
      };
    }

    setComments(commentsData);
    setCommentLikes(likesMap);
  };

  loadComments();
}, [post, userData]);


  // 🔹 Fetch Likes
  useEffect(() => {
    if (!post) return;

    const loadLikes = async () => {
      const likes = await appwriteService.getLikes(post.$id);
      setLikesCount(likes?.total || 0);

      if (userData) {
        const userLike = await appwriteService.getUserLike(post.$id, userData.$id);

        if (userLike?.total > 0) {
          setLiked(true);
          setLikeDocId(userLike.documents[0].$id);
        } else {
          setLiked(false);
        }
      }
    };

    loadLikes();
  }, [post, userData]);

  // comment toggle
  const toggleCommentLike = async (commentId) => {
  if (!userData) return;

  const current = commentLikes[commentId];

  if (current?.liked) {
    await appwriteService.unlikeComment(current.likeDocId);

    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        liked: false,
        count: prev[commentId].count - 1,
      },
    }));
  } else {
    const newLike = await appwriteService.likeComment(commentId, userData.$id);

    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: {
        liked: true,
        likeDocId: newLike.$id,
        count: prev[commentId]?.count + 1 || 1,
      },
    }));
  }
};


  // 🔹 Toggle Like
    const toggleLike = async () => {
      if (!userData) return;

      if (liked) {
        await appwriteService.unlikePost(likeDocId);
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        const newLike = await appwriteService.likePost(post.$id, userData.$id);
        setLikeDocId(newLike.$id);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    };

  // 🔹 Add Comment
    const handleComment = async () => {
      if (!newComment.trim()) return;

      const comment = await appwriteService.addComment(
        post.$id,
        userData.$id,
        userData.name,
        newComment
      );

      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    };
    const getInitial = (name) => {
      if (!name) return "U";
      return name.charAt(0).toUpperCase();
    };

    const getColor = (name) => {
      if (!name) return "bg-gray-400";

      const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-yellow-500",
        "bg-red-500",
      ];

      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    };



    const deletePost = async () => {
    try {
      const status = await appwriteService.deletePost(post.$id);

      if (status && post.featuredImage) {
        await appwriteService.deleteFile(post.featuredImage);
      }

      navigate("/");
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };


    if (loading) {
    return <div className="py-20 text-center">Loading article...</div>;
    }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Container>
        {isAuthor && (
          <div className="flex justify-end gap-3 mb-6">
          <Link to={`/edit-post/${post.$id}`}>
          <Button variant="secondary">Edit</Button>
          </Link>

        <Button
        variant="danger"
        onClick={() => setShowConfirm(true)}
      >
        Delete
        </Button>

  </div>
)}



        {/* HERO IMAGE */}
        {post.featuredImage && (
          <div className="mb-12">

            <div className="rounded-3xl overflow-hidden shadow-xl border bg-white">

              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="w-full object-contain max-h-[650px] bg-gray-100"
              />

              {/* Info Bar */}
              <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-white border-t">

              {/* LEFT → AUTHOR */}
                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {post.authorName?.charAt(0) || "U"}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {post.authorName || "Unknown Author"}
                    </p>

                    <p className="text-xs text-gray-500 break-all">
                      {post.userId}
                    </p>
                  </div>

                    {/* FOLLOW BUTTON */}
                    {userData && post.userId !== userData.$id && (
                      <button
                        onClick={toggleFollow}
                        className={`ml-4 px-4 py-1.5 rounded-full text-sm font-semibold transition
                          ${isFollowing
                            ? "bg-gray-200 text-gray-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"}
                        `}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                </div>

                  {/* RIGHT → LIKE */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleLike}
                    className={`px-4 py-2 rounded-full font-medium transition
                      ${liked
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"}
                    `}
                  >
                    ❤️ {liked ? "Liked" : "Like"}
                  </button>

                  <span className="text-gray-600 font-medium">
                    {likesCount} Likes
                  </span>
                </div>

              </div>
            </div>
          </div>
        )}


        {/* ARTICLE */}
        <article className="bg-white rounded-2xl shadow-md p-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

          <div className="prose max-w-none">{parse(post.content)}</div>
        </article>

        {/* COMMENTS — ALWAYS SHOW */}
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow">
          {/* COMMENTS — Styled Like Article */}
                        <section className="max-w-3xl mx-auto mt-14">

                        {/* Divider like Medium */}
                          <div className="border-t pt-10">

                          <h2 className="text-2xl font-bold mb-8 text-gray-900">
                            Responses ({comments.length})
                            </h2>

                        {/* Comment Input */}
                  
                      {userData && (
                        <div className="flex gap-4 items-start mb-8">

                          {/* Logged-in user avatar */}
                            <div
                              className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold ${getColor(userData.name)}`}
                              >
                              {getInitial(userData.name)}
                            </div>

                      {/* Input box */}
                        <div className="flex-1">
                          <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                          placeholder="Write a response..."
                          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />

                          <div className="flex justify-end mt-3">
                            <button
                            onClick={handleComment}
                            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                            >
                            Respond
                            </button>
                          </div>
                        </div>
                      </div>
                    )}


                
                        <div className="space-y-10">
                          {comments.map((c) => (
                            <div key={c.$id} className="flex gap-4">

                              {/* Avatar */}
                                <div
                                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold flex-shrink-0 ${getColor(c.userName)}`}
                                    >
                                  {getInitial(c.userName)}
                                </div>

                        <div className="flex-1">

                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">
                              {c.userName}
                            </p>

                            <button
                                onClick={() => toggleCommentLike(c.$id)}
                                className={`text-sm px-3 py-1 rounded-full transition
                                ${commentLikes[c.$id]?.liked
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"}`}
                                >
                              ❤️ {commentLikes[c.$id]?.count || 0}
                            </button>
                          </div>

                        <p className="text-gray-700 mt-2 leading-relaxed">
                          {c.comment}
                        </p>

                      </div>
                    </div>
                  ))}
                </div>


              </div>
              </section>


        </div>
              {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center w-80">
              <h3 className="text-xl font-bold mb-3">Delete Post?</h3>
              <p className="text-gray-500 mb-6">
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  onClick={deletePost}   // 🔥 THIS WAS MISSING
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </div>
        )}


      </Container>
    </div>
  );
}
