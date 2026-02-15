function Logo({ width = "120px", showText = true }) {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">

      {/* Logo Image */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png"
        alt="logo"
        style={{ width }}
        className="transition duration-300 group-hover:scale-110 drop-shadow-md"
      />

      {/* Brand Name */}
      {showText && (
        <span className="text-xl font-bold tracking-wide text-white-800 group-hover:text-blue-600 transition">
          Target World
        </span>
      )}
    </div>
  );
}

export default Logo;
