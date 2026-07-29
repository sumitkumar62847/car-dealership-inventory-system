import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">

          <div>
            <Link
              to="/"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2.5"
            >

              <span className="text-[18px] font-bold tracking-tight text-[#1d1d1f]">
                CarDealership
              </span>
            </Link>

            <p className="mt-4 max-w-[340px] text-[13px] leading-6 text-[#86868b]">
              A simple vehicle inventory platform for browsing,
              filtering and purchasing available vehicles.
            </p>
          </div>


          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1d1d1f]">
              Platform
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[13px] font-semibold text-[#515154]">
                  Vehicle Inventory
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#86868b]">
                  Browse all currently available vehicles.
                </p>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#515154]">
                  Smart Filtering
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#86868b]">
                  Search by brand, model, category and price.
                </p>
              </div>
            </div>
          </div>


          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1d1d1f]">
              Inventory Management
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[13px] font-semibold text-[#515154]">
                  Real-time Stock
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#86868b]">
                  Vehicle availability updates after purchases.
                </p>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#515154]">
                  Admin Controls
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#86868b]">
                  Add, update, restock and manage vehicle inventory.
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="mt-10 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[12px] text-[#86868b]">
            © {currentYear} CarDealership. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex w-fit items-center gap-2 text-[12px] font-semibold text-[#515154] transition-colors hover:text-[#0071e3]"
          >
            Back to top

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
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;