import { useState } from "react";
import authService from "../appwrite/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice.js";
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const passwordValue = watch("password");

  // password strength
  const getStrength = (pass) => {
    if (!pass) return "";
    if (pass.length < 6) return "Weak";
    if (pass.length < 10) return "Medium";
    return "Strong";
  };

  const create = async (data) => {
    setError("");
    setLoading(true);

    try {
      const user = await authService.createAccount(data);
      if (user) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Signup failed");
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

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account 🚀
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Join us and start your journey
        </p>

        {/* Error */}
        {error && (
          <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(create)} className="mt-6 space-y-5">

          {/* Name */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
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
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
          />

          {/* Password strength */}
          {passwordValue && (
            <div className="text-sm">
              Strength:{" "}
              <span
                className={`font-semibold ${
                  getStrength(passwordValue) === "Weak"
                    ? "text-red-500"
                    : getStrength(passwordValue) === "Medium"
                    ? "text-yellow-500"
                    : "text-green-600"
                }`}
              >
                {getStrength(passwordValue)}
              </span>
            </div>
          )}

          {/* Button */}
          <Button
            type="submit"
            loading={loading}
            className="w-full text-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
