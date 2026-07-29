import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import VehicleCard from "../components/VehicleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";

import {
  getVehicles,
  searchVehicles,
  purchaseVehicle,
} from "../services/api";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [purchasingId, setPurchasingId] = useState(null);
  const [purchasedId, setPurchasedId] = useState(null);

  const [hasSearched, setHasSearched] = useState(false);


  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getVehicles();

      setVehicles(data.vehicles || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load vehicles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setError("");

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== ""
        )
      );

      const data = await searchVehicles(cleanFilters);

      setVehicles(data.vehicles || []);
      setHasSearched(true);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to search vehicles."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleReset = async () => {
    setHasSearched(false);
    await fetchVehicles();
  };


  const handlePurchase = async (vehicleId) => {
    try {
      setPurchasingId(vehicleId);
      setError("");

      const data = await purchaseVehicle(vehicleId);

      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) =>
          vehicle._id === vehicleId
            ? data.vehicle
            : vehicle
        )
      );

      setPurchasedId(vehicleId);

      setTimeout(() => {
        setPurchasedId((current) =>
          current === vehicleId ? null : current
        );
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to purchase vehicle."
      );
    } finally {
      setPurchasingId(null);
    }
  };


  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f7f8fa] font-sans text-[#1d1d1f] antialiased">


      <Navbar />

      <main className="flex-1">


        <section
          className="
            relative
            min-h-[460px]
            overflow-hidden
            bg-[#080d18]

            sm:min-h-[520px]
            lg:min-h-[570px]
          "
        >
          {/* Background */}

          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2000&auto=format&fit=crop"
              alt=""
              className="
                h-full w-full
                object-cover
                object-[68%_center]

                sm:object-center
              "
            />

            {/* Main dark overlay */}

            <div
              className="
                absolute inset-0
                bg-gradient-to-r
                from-[#080d18]
                via-[#080d18]/90
                to-[#080d18]/25
              "
            />

            {/* Mobile bottom overlay */}

            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-[#080d18]/90
                via-transparent
                to-[#080d18]/20

                sm:hidden
              "
            />
          </div>

          {/* Hero Content */}

          <div
            className="
              relative
              mx-auto
              flex min-h-[460px]
              max-w-[1400px]
              items-center
              px-5
              pb-16
              pt-24

              sm:min-h-[520px]
              sm:px-6
              sm:pb-20
              sm:pt-28

              lg:min-h-[570px]
              lg:px-8
            "
          >
            <div className="max-w-[670px]">

              {/* Badge */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border border-white/10
                  bg-white/5
                  px-3.5 py-1.5
                  backdrop-blur-md
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#2997ff]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#69b7ff] sm:text-[11px]">
                  Dealership Inventory
                </span>
              </div>

              {/* Heading */}

              <h1
                className="
                  max-w-[620px]
                  text-[40px]
                  font-bold
                  leading-[1.05]
                  tracking-[-0.045em]
                  text-white

                  sm:text-[54px]
                  lg:text-[68px]
                "
              >
                Find the vehicle
                <br />

                <span className="text-[#2997ff]">
                  made for you.
                </span>
              </h1>

              {/* Description */}

              <p
                className="
                  mt-5
                  max-w-[550px]
                  text-[15px]
                  leading-6
                  text-gray-300

                  sm:mt-6
                  sm:text-[17px]
                  sm:leading-7
                "
              >
                Explore our available inventory and find
                your next vehicle by brand, model,
                category, and price.
              </p>

              {/* Small hero stats */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-x-6
                  gap-y-3

                  sm:mt-8
                "
              >
                <div className="flex items-center gap-2 text-[12px] font-medium text-gray-300 sm:text-[13px]">
                  <svg
                    className="h-4 w-4 text-[#2997ff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                  Quality inventory
                </div>

                <div className="flex items-center gap-2 text-[12px] font-medium text-gray-300 sm:text-[13px]">
                  <svg
                    className="h-4 w-4 text-[#2997ff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                  Simple purchasing
                </div>
              </div>
            </div>
          </div>
        </section>


        <section
          className="
            relative z-30
            mx-auto
            -mt-12
            max-w-[1400px]

            sm:-mt-14
          "
        >
          <SearchBar
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </section>


        <section
          className="
            mx-auto
            max-w-[1400px]
            px-4
            pb-16
            pt-3

            sm:px-6
            sm:pb-20
            sm:pt-6

            lg:px-8
          "
        >
       

          {error && (
            <div
              className="
                mx-auto mb-7
                flex max-w-3xl
                items-start
                gap-3
                rounded-2xl
                border border-red-100
                bg-red-50
                px-4 py-3.5
              "
            >
              <div
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-red-100
                "
              >
                <svg
                  className="h-4 w-4 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-red-700">
                  Something went wrong
                </p>

                <p className="mt-0.5 text-[12px] leading-5 text-red-600 sm:text-[13px]">
                  {error}
                </p>
              </div>
            </div>
          )}



          {loading && (
            <div
              className="
                flex min-h-[300px]
                flex-col
                items-center
                justify-center
              "
            >
              <LoadingSpinner />

              <p className="mt-4 text-[14px] font-medium text-[#86868b]">
                Loading inventory...
              </p>
            </div>
          )}


          {!loading &&
            !error &&
            vehicles.length === 0 && (
              <div
                className="
                  mx-auto
                  max-w-[600px]
                  rounded-[24px]
                  border border-gray-200/70
                  bg-white
                  px-6 py-12
                  text-center
                  shadow-[0_6px_30px_rgba(0,0,0,0.04)]

                  sm:px-12
                  sm:py-14
                "
              >
                {/* Icon */}

                <div
                  className="
                    mx-auto mb-5
                    flex h-14 w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f5f5f7]
                  "
                >
                  <svg
                    className="h-6 w-6 text-[#86868b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.7}
                      d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {hasSearched
                    ? "No vehicles match your search"
                    : "No vehicles available"}
                </h2>

                <p
                  className="
                    mx-auto mt-2
                    max-w-[420px]
                    text-[13px]
                    leading-6
                    text-[#86868b]

                    sm:text-[14px]
                  "
                >
                  {hasSearched
                    ? "Try changing your brand, model, category, or price range."
                    : "There are currently no vehicles in the inventory."}
                </p>

                {hasSearched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="
                      mt-6
                      rounded-full
                      bg-[#0071e3]
                      px-6 py-2.5
                      text-[14px]
                      font-semibold
                      text-white
                      transition-all

                      hover:bg-[#0077ed]
                      active:scale-[0.98]
                    "
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}


          {!loading &&
            !error &&
            vehicles.length > 0 && (
              <>
                {/* Inventory Header */}

                <div
                  className="
                    mb-6
                    flex flex-col
                    gap-3

                    sm:mb-8
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                  "
                >
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0071e3]" />

                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0071e3] sm:text-[11px]">
                        Our Collection
                      </p>
                    </div>

                    <h2
                      className="
                        text-[24px]
                        font-semibold
                        tracking-[-0.025em]

                        sm:text-[30px]
                      "
                    >
                      Available Inventory
                    </h2>

                    <p className="mt-1 max-w-xl text-[13px] leading-5 text-[#86868b] sm:text-[14px]">
                      Browse the vehicles currently
                      available for purchase.
                    </p>
                  </div>

                  {/* Vehicle count */}

                  <div
                    className="
                      inline-flex
                      w-fit
                      items-center
                      gap-2
                      rounded-full
                      border border-gray-200
                      bg-white
                      px-3.5 py-2
                      text-[12px]
                      font-semibold
                      text-[#515154]
                      shadow-sm
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    {vehicles.length}{" "}
                    {vehicles.length === 1
                      ? "vehicle"
                      : "vehicles"}
                  </div>
                </div>

                {/* Grid */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4

                    sm:grid-cols-2
                    sm:gap-5

                    lg:grid-cols-3
                    lg:gap-6
                  "
                >
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle._id}
                      vehicle={vehicle}
                      onPurchase={handlePurchase}
                      purchasing={
                        purchasingId === vehicle._id
                      }
                      purchased={
                        purchasedId === vehicle._id
                      }
                    />
                  ))}
                </div>
              </>
            )}


          {!loading && !error && (
            <section
              className="
                mt-14
                overflow-hidden
                rounded-[24px]
                border border-gray-200/70
                bg-white

                sm:mt-20
                sm:rounded-[28px]
              "
            >
              {/* Benefits heading */}

              <div
                className="
                  border-b border-gray-100
                  px-5 py-5

                  sm:px-8
                  sm:py-6
                "
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0071e3]">
                  Why choose us
                </p>

                <h3 className="mt-1 text-[20px] font-semibold tracking-tight sm:text-[22px]">
                  A simpler way to buy your next vehicle.
                </h3>
              </div>

              {/* Features */}

              <div
                className="
                  grid grid-cols-1

                  sm:grid-cols-2
                  lg:grid-cols-4
                "
              >
                {/* Quality */}

                <Feature
                  title="Quality Inventory"
                  description="Carefully selected vehicles."
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  }
                />

                {/* Pricing */}

                <Feature
                  title="Clear Pricing"
                  description="Simple and transparent prices."
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M3 3h7l11 11-7 7L3 10V3z"
                    />
                  }
                />

                {/* Inventory */}

                <Feature
                  title="Live Inventory"
                  description="See current vehicle availability."
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h10"
                    />
                  }
                />

                {/* Purchase */}

                <Feature
                  title="Easy Purchase"
                  description="A fast and simple purchase flow."
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h2m3 0h2M6 19h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  }
                />
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};


const Feature = ({
  title,
  description,
  icon,
}) => {
  return (
    <div
      className="
        flex items-start
        gap-4
        border-b border-gray-100
        px-5 py-6

        last:border-b-0

        sm:px-6

        sm:[&:nth-child(odd)]:border-r
        lg:border-b-0
        lg:border-r
        lg:last:border-r-0
      "
    >
      <div
        className="
          flex h-10 w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-blue-50
          text-[#0071e3]
        "
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon}
        </svg>
      </div>

      <div>
        <h4 className="text-[14px] font-semibold text-[#1d1d1f]">
          {title}
        </h4>

        <p className="mt-1 text-[12px] leading-5 text-[#86868b]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;