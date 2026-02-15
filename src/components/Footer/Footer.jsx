import { Link } from "react-router-dom";
import Logo from "../Logo";
function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-12 pb-8 mt-16">
      
      {/* top glow line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo + tagline */}
          <div className="text-center md:text-left">
            <Logo width="90px" />
            <p className="mt-3 text-sm text-gray-400">
              Read. Write. Share ideas with the world.
            </p>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <Link
                  to="/"
                  className="relative group"
                >
                  Home
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              <li>
                <Link
                  to="/all-posts"
                  className="relative group"
                >
                  All Posts
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </nav>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
