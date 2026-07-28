import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
   <nav className="bg-gray-900 text-white shadow-md">
  <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <Link
        to="/"
        className="text-xl font-bold"
      >
        CarDealership
      </Link>

      {isAuthenticated && (
        <div className="flex flex-wrap items-center gap-4">

          <Link
            to="/"
            className="text-sm text-gray-300 hover:text-white"
          >
            Vehicles
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-gray-300 hover:text-white"
            >
              Admin Dashboard
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700"
          >
            Logout
          </button>

        </div>
      )}

    </div>
  </div>
</nav>
  );
};

export default Navbar;