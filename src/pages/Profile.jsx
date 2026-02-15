import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";

function Profile() {
const [followers, setFollowers] = useState(0);
const [following, setFollowing] = useState(0);

const userData = useSelector((state) => state.auth.userData);
const navigate = useNavigate();

const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

  // 🔐 Password States
const [showPasswordBox, setShowPasswordBox] = useState(false);
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [changingPass, setChangingPass] = useState(false);
const [passMessage, setPassMessage] = useState("");

    useEffect(() => {
        if (!userData) {
        navigate("/login");
        return;
        }
        // here do something
        const loadFollowStats = async () => {
            const f1 = await appwriteService.getFollowersCount(userData.$id);
            const f2 = await appwriteService.getFollowingCount(userData.$id);

            setFollowers(f1.total);
            setFollowing(f2.total);
        };

        loadFollowStats();
        // here end

        const fetchUserPosts = async () => {
        try {
            const res = await appwriteService.getPostsByUser(userData.$id);
            setPosts(res.documents);
        } catch (err) {
            console.log("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchUserPosts();
    }, [userData]);

  // 🔐 Change Password Handler
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            setPassMessage("❌ Fill both fields");
            return;
        }

        if (newPassword.length < 6) {
        setPassMessage("❌ Password must be at least 6 characters");
        return;
        }

        setChangingPass(true);
        setPassMessage("");

        try {
        await authService.updatePassword(oldPassword, newPassword);

        setPassMessage("✅ Password updated successfully");

        setOldPassword("");
        setNewPassword("");

        // Hide box after success
        setTimeout(() => {
            setShowPasswordBox(false);
            setPassMessage("");
        }, 1500);

        } catch (err) {
        setPassMessage("❌ Wrong current password");
        } finally {
        setChangingPass(false);
        }
    };

    if (!userData) return null;


return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10">
    <div className="max-w-6xl mx-auto space-y-10 px-4">

      {/* PROFILE SECTION */}
      <div className="bg-white rounded-3xl shadow-xl p-10">
        <div className="flex flex-col md:flex-row md:items-center gap-8">

          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {userData.name.charAt(0)}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
            <p className="text-gray-500">{userData.email}</p>
            <p className="text-xs text-gray-400 break-all mt-1">
              ID: {userData.$id}
            </p>
          </div>

          {/* Change Password */}
          <button
            onClick={() => setShowPasswordBox(!showPasswordBox)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
            {showPasswordBox ? "Cancel" : "Change Password"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{followers}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{following}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{posts.length}</p>
            <p className="text-gray-500 text-sm">Posts</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800">Active</p>
            <p className="text-gray-500 text-sm">Status</p>
          </div>
        </div>

        {/* PASSWORD BOX */}
        {showPasswordBox && (
          <div className="mt-10 max-w-lg bg-gray-50 p-6 rounded-2xl border space-y-4">
            <h3 className="font-semibold text-lg text-gray-700">
              Update Password
            </h3>

            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={handleChangePassword}
              disabled={changingPass}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow transition"
            >
              {changingPass ? "Updating..." : "Update Password"}
            </button>

            {passMessage && (
              <p className="text-sm text-gray-600">{passMessage}</p>
            )}
          </div>
        )}
      </div>

      {/* POSTS SECTION */}
      <div className="bg-white rounded-3xl shadow-xl p-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          Your Posts ({posts.length})
        </h2>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">You haven't created any posts yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.$id} to={`/post/${post.$id}`}>
                <div className="bg-gray-50 p-6 rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition duration-300">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-4">
                    Status: {post.status}
                  </p>

                  <span className="text-blue-600 text-sm font-medium">
                    View Post →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  </div>
);

}

export default Profile;
