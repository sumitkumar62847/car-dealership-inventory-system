import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  const inputStyles = `
    w-full
    rounded-xl
    border border-gray-200
    bg-[#f7f7f9]
    px-4 py-3.5
    text-[14px]
    text-[#1d1d1f]
    outline-none
    transition-all
    placeholder:text-[#a1a1a6]

    hover:border-gray-300

    focus:border-[#0071e3]
    focus:bg-white
    focus:ring-4
    focus:ring-[#0071e3]/10

    disabled:cursor-not-allowed
    disabled:opacity-60
  `;

  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f] antialiased">

      <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section
          className="
            relative
            min-h-[300px]
            overflow-hidden
            bg-[#080d18]
            pt-[68px]

            sm:min-h-[350px]

            lg:min-h-screen
          "
        >

          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=85&w=1800&auto=format&fit=crop"
            alt="Premium vehicle"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Overlay */}

          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-[#050912]
              via-[#050912]/45
              to-[#050912]/20

              lg:bg-gradient-to-r
              lg:from-[#050912]/85
              lg:via-[#050912]/45
              lg:to-transparent
            "
          />

          {/* Content */}

          <div
            className="
              relative
              flex h-full
              min-h-[232px]
              items-end
              px-5 pb-7

              sm:min-h-[282px]
              sm:px-8
              sm:pb-9

              lg:min-h-screen
              lg:items-center
              lg:px-12
              lg:pb-0
              lg:pt-[68px]

              xl:px-16
            "
          >
            <div className="max-w-[580px]">

              {/* Eyebrow */}

              <div className="mb-4 hidden items-center gap-2 lg:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2997ff]" />

                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#69b7ff]">
                  Join CarDealership
                </span>
              </div>

              {/* Heading */}

              <h1
                className="
                  max-w-[540px]
                  text-[28px]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-white

                  sm:text-[34px]

                  lg:text-[50px]
                  lg:font-bold
                  lg:tracking-[-0.045em]

                  xl:text-[58px]
                "
              >
                Find a vehicle
                <br className="hidden lg:block" /> you'll love to drive.
              </h1>

              {/* Description */}

              <p
                className="
                  mt-3
                  max-w-[500px]
                  text-[13px]
                  leading-5
                  text-gray-300

                  sm:text-[14px]

                  lg:mt-5
                  lg:text-[16px]
                  lg:leading-7
                "
              >
                Create your account to explore our dealership
                inventory and find the vehicle that's right for you.
              </p>

              {/* Desktop features */}

              <div className="mt-8 hidden grid-cols-3 gap-6 border-t border-white/15 pt-6 lg:grid">
                <ImageFeature
                  title="Explore"
                  text="Browse inventory"
                />

                <ImageFeature
                  title="Compare"
                  text="Find your match"
                />

                <ImageFeature
                  title="Purchase"
                  text="Simple process"
                />
              </div>
            </div>
          </div>
        </section>

       

        <section
          className="
            flex
            items-center
            justify-center
            bg-white
            px-5
            py-10

            sm:px-8
            sm:py-14

            lg:px-12
            lg:pb-12
            lg:pt-[100px]
          "
        >
          <div className="w-full max-w-[430px]">

            {/* Header */}

            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0071e3]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0071e3]">
                  Create Account
                </span>
              </div>

              <h2
                className="
                  text-[30px]
                  font-semibold
                  tracking-[-0.035em]
                  text-[#1d1d1f]

                  sm:text-[36px]
                "
              >
                Get started
              </h2>

              <p className="mt-2 text-[14px] leading-6 text-[#86868b]">
                Create your account to browse and purchase vehicles
                from our available inventory.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-[13px] font-bold text-red-600">
                  !
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-red-700">
                    Registration failed
                  </p>

                  <p className="mt-0.5 text-[12px] leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            )}



            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[13px] font-semibold text-[#515154]"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserIcon />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className={`${inputStyles} pl-11`}
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[13px] font-semibold text-[#515154]"
                >
                  Email address
                </label>

                <div className="relative">
                  <EmailIcon />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={loading}
                    className={`${inputStyles} pl-11`}
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] font-semibold text-[#515154]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockIcon />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    disabled={loading}
                    className={`${inputStyles} pl-11 pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex h-8 w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-[#86868b]
                      transition-colors

                      hover:bg-gray-100
                      hover:text-[#1d1d1f]
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>
                </div>

                {/* Password helper */}

                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#86868b]">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      strokeWidth={1.8}
                    />

                    <path
                      strokeLinecap="round"
                      strokeWidth={1.8}
                      d="M12 10v6m0-9h.01"
                    />
                  </svg>

                  Choose a secure password for your account.
                </div>
              </div>

              {/* Register Button */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#0071e3]
                  py-3.5
                  text-[14px]
                  font-semibold
                  text-white
                  shadow-[0_5px_15px_rgba(0,113,227,0.2)]
                  transition-all

                  hover:bg-[#0077ed]
                  hover:shadow-[0_7px_20px_rgba(0,113,227,0.25)]

                  active:scale-[0.99]

                  disabled:cursor-not-allowed
                  disabled:bg-gray-200
                  disabled:text-gray-400
                  disabled:shadow-none
                "
              >
                {loading && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}

                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>
            </form>


            <div className="mt-7 border-t border-gray-100 pt-6 text-center">
              <p className="text-[13px] text-[#86868b]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#0071e3] transition-colors hover:text-[#0077ed]"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Security */}

            <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#a1a1a6]">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3l7 3v5c0 4.4-2.8 8.4-7 10-4.2-1.6-7-5.6-7-10V6l7-3z"
                />
              </svg>

              Secure account registration
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};


const ImageFeature = ({ title, text }) => {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2997ff]/20 text-[#69b7ff]">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <span className="text-[12px] font-semibold text-white">
          {title}
        </span>
      </div>

      <p className="text-[11px] text-gray-400">
        {text}
      </p>
    </div>
  );
};


const UserIcon = () => (
  <svg
    className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#86868b]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle
      cx="12"
      cy="8"
      r="4"
      strokeWidth={1.8}
    />

    <path
      strokeLinecap="round"
      strokeWidth={1.8}
      d="M4 20c.8-4 3.5-6 8-6s7.2 2 8 6"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#86868b]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#86868b]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M7 10V8a5 5 0 0110 0v2m-11 0h12a2 2 0 012 2v7H4v-7a2 2 0 012-2z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="h-[18px] w-[18px]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
    />

    <circle
      cx="12"
      cy="12"
      r="2.5"
      strokeWidth={1.8}
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="h-[18px] w-[18px]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10 10 0 0112 5c6 0 9.5 7 9.5 7a15 15 0 01-2.1 3M6.2 6.2C3.8 8 2.5 12 2.5 12S6 19 12 19a9 9 0 004-.9"
    />
  </svg>
);

export default Register;