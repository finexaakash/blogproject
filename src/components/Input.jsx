import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  {
    label,
    type = "text",
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = "outlined",
    className = "",
    disabled = false,
    ...props
  },
  ref
) {
  const id = useId();

  const variants = {
    outlined:
      "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400",
    filled:
      "bg-gray-100 border border-transparent focus:ring-2 focus:ring-blue-400",
    ghost:
      "border-b border-gray-300 rounded-none bg-transparent focus:border-blue-500",
  };

  return (
    <div className="w-full space-y-1">

      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={`
        flex items-center gap-2 px-3 py-2 rounded-xl
        transition-all duration-200
        ${variants[variant]}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${error ? "border-red-500 focus-within:ring-red-400" : ""}
        `}
      >

        {leftIcon && <span className="text-gray-400">{leftIcon}</span>}

        <input
          id={id}
          ref={ref}
          type={type}
          disabled={disabled}
          className={`
            w-full bg-transparent outline-none text-gray-800 placeholder-gray-400
            ${className}
          `}
          {...props}
        />

        {rightIcon && <span className="text-gray-400">{rightIcon}</span>}
      </div>

      {/* Error / Helper text */}
      {(error || helperText) && (
        <p
          className={`text-sm ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
