import { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
function LogoutBtn() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const logoutHandler = async () => {
    try {
      setLoading(true);
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={logoutHandler}
      disabled={loading}
      aria-label="Logout"
      className={`
        px-6 py-2 rounded-full font-medium transition-all duration-300
        ${loading 
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-red-500 text-white hover:bg-red-600 hover:shadow-md active:scale-95"}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Logging out...
        </span>
      ) : (
        "Logout"
      )}
    </button>
  );
}
export default LogoutBtn;
