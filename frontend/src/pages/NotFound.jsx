import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f7] px-4 font-sans antialiased">
      <div className="text-center">
        {/* Large 404 Heading */}
        <h1 className="text-7xl font-semibold tracking-tight text-[#1d1d1f] sm:text-9xl">
          404
        </h1>
        
        {/* Subtitle */}
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
          Page not found.
        </h2>
        
        {/* Description */}
        <p className="mx-auto mt-4 max-w-sm text-[15px] text-[#86868b]">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action Button */}
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#0071e3] px-8 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-[#0077ED]"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;