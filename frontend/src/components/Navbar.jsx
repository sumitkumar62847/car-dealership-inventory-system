import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navbarRef = useRef(null);

  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminPage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAdminPage]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200/60 bg-white/90 text-[#1d1d1f] shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-[#0a0f1c]/80 to-transparent text-white"
      }`}
    >

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[64px] items-center justify-between">

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            CarDealership
          </Link>


          {isAuthenticated && (
            <div className="hidden items-center gap-6 sm:flex lg:gap-8">
              {isAdmin && (
                <>
                  <Link
                    to="/"
                    className={`text-[14px] font-semibold transition-colors ${
                      location.pathname === "/"
                        ? isScrolled
                          ? "text-[#0071e3]"
                          : "text-white"
                        : isScrolled
                        ? "text-[#282829] hover:text-[#0071e3]"
                        : "text-gray-200 hover:text-white"
                    }`}
                  >
                    Vehicles
                  </Link>

                  <Link
                    to="/admin"
                    className={`text-[14px] font-semibold transition-colors ${
                      isAdminPage
                        ? "text-[#0071e3]"
                        : isScrolled
                        ? "text-[#28282a] hover:text-[#0071e3]"
                        : "text-gray-200 hover:text-white"
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className={`ml-2 rounded-full px-5 py-2 text-[14px] font-medium transition-all ${
                  isScrolled
                    ? "bg-gray-100 text-[#1d1d1f] hover:bg-red-50 hover:text-red-600"
                    : "border border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10"
                }`}
              >
                Logout
              </button>
            </div>
          )}


          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:hidden ${
                isScrolled
                  ? "text-[#1d1d1f] hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>


      {isAuthenticated && mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white text-[#1d1d1f] shadow-xl sm:hidden">
          <div className="mx-auto max-w-[1400px] px-4 py-3">

            {/* Vehicles */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                location.pathname === "/"
                  ? "bg-blue-50 text-[#0071e3]"
                  : "text-[#1d1d1f] hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 13l2-5a2 2 0 012-1h10a2 2 0 012 1l2 5M5 13h14v5H5v-5z"
                  />
                </svg>

                Vehicles
              </div>

              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`mt-1 flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                  isAdminPage
                    ? "bg-blue-50 text-[#0071e3]"
                    : "text-[#1d1d1f] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M4 6h6v6H4V6zm10 0h6v6h-6V6zM4 16h6v4H4v-4zm10 0h6v4h-6v-4z"
                    />
                  </svg>

                  Admin Dashboard
                </div>

                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}

            <div className="my-3 border-t border-gray-100" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
              </svg>

              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;