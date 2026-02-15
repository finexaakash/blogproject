import { Container, Logo, LogoutBtn } from "../index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Profile", slug:"/profile", active: authStatus},
  ];
  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-300
        backdrop-blur-lg border-b
        ${scrolled
          ? "bg-white/90 shadow-md border-gray-200"
          : "bg-white/60 border-transparent"}
      `}
    >
      <Container>
        <nav className="flex items-center justify-between py-3">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <Logo width="60px" />
            <span className="font-bold text-lg tracking-wide hidden sm:block group-hover:text-blue-600 transition">
              
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-2">

            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`
                        relative px-5 py-2 rounded-xl text-sm font-semibold
                        transition-all duration-300
                        ${
                          location.pathname === item.slug
                            ? "text-white bg-blue-600 shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      {item.name}

                      {/* active underline animation */}
                      {location.pathname === item.slug && (
                        <span className="absolute left-1/2 -bottom-1 h-[2px] w-6 -translate-x-1/2 bg-white rounded"></span>
                      )}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li className="ml-2">
                <LogoutBtn />
              </li>
            )}
          </ul>
          {/* Mobile Button */}
          <button
            aria-label="Toggle Menu"
            className="md:hidden text-2xl transition hover:scale-110"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300
            ${menuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"}
          `}
        >
          <ul className="flex flex-col gap-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug);
                        setMenuOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg font-medium
                        transition
                        ${
                          location.pathname === item.slug
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100"
                        }
                      `}
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {authStatus && (
              <li className="pt-2">
                <LogoutBtn />
              </li>
            )}
          </ul>
        </div>
      </Container>

      {/* gradient glow bottom line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></div>
    </header>
  );
}

export default Header;
