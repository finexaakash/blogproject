
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const login = async (data) => {
    setError("");
    setLoading(true);

    try {
      const session = await authService.login(data);

      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
  dispatch(authLogin(userData));

  // Force full refresh
  window.location.href = "/";
}

      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
return (
<div className="min-h-screen flex items-center justify-center p-4">

      {/* Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/80 shadow-2xl rounded-2xl p-10 border border-white/40">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Logo width="90px" />
        </div>
        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Sign in to continue
        </p>

        {/* Error */}
        {error && (
          <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">

          {/* Email */}
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Enter a valid email",
              },
            })}
          />

          {/* Password */}
          <Input
            label="Password"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-xs text-blue-600 font-semibold"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            }
            {...register("password", {
              required: "Password is required",
            })}
          />

          {/* Button */}
          <Button
            type="submit"
            loading={loading}
            className="w-full text-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
      </div>
   );
  }
export default Login;
