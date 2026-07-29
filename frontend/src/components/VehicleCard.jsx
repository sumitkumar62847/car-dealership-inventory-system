import { formatPrice } from "../utils/formatters";

const VehicleCard = ({
  vehicle,
  onPurchase,
  purchasing,
  purchased,
}) => {
  const inStock = vehicle.quantity > 0;

  return (
    <article
      className="
        group flex h-full flex-col
        rounded-[22px] border border-gray-200/70
        bg-white
        p-5
        shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        transition-all duration-300

        sm:p-6

        md:rounded-3xl md:p-7
        md:hover:-translate-y-1
        md:hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]
      "
    >


      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">

          {/* Category */}
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0071e3]" />

            <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#86868b] sm:text-[12px]">
              {vehicle.category}
            </p>
          </div>

          {/* Vehicle Name */}
          <h2
            className="
              text-[20px] font-semibold leading-tight tracking-[-0.02em]
              text-[#1d1d1f]

              sm:text-[22px]
              md:text-2xl
            "
          >
            {vehicle.make} {vehicle.model}
          </h2>
        </div>

        {/* Stock Badge */}
        <span
          className={`
            inline-flex shrink-0 items-center gap-1.5
            rounded-full
            px-2.5 py-1
            text-[11px] font-semibold

            sm:text-xs

            ${
              inStock
                ? "bg-[#eaf8f0] text-[#147a42]"
                : "bg-[#fff1f1] text-[#cc292b]"
            }
          `}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              inStock ? "bg-[#22a35a]" : "bg-[#cc292b]"
            }`}
          />

          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-gray-100 sm:my-6" />



      <div className="mb-5">
        <p className="mb-1 text-[12px] font-medium text-[#86868b]">
          Price
        </p>

        <p
          className="
            text-[26px] font-semibold tracking-[-0.03em]
            text-[#1d1d1f]

            sm:text-[28px]
          "
        >
          {formatPrice(vehicle.price)}
        </p>
      </div>


      <div
        className="
          mb-6 flex items-center justify-between
          rounded-xl bg-[#f7f7f9]
          px-4 py-3
        "
      >
        <div className="flex items-center gap-2">

          {/* Inventory Icon */}
          <svg
            className="h-[18px] w-[18px] text-[#86868b]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>

          <span className="text-[13px] font-medium text-[#515154] sm:text-[14px]">
            Available
          </span>
        </div>

        <span className="text-[13px] font-semibold text-[#1d1d1f] sm:text-[14px]">
          {vehicle.quantity} {vehicle.quantity === 1 ? "unit" : "units"}
        </span>
      </div>


      <button
        type="button"
        onClick={() => onPurchase(vehicle._id)}
        disabled={!inStock || purchasing || purchased}
        className={`
          mt-auto
          flex w-full items-center justify-center gap-2
          rounded-xl
          px-4 py-3.5
          text-[14px] font-semibold
          transition-all duration-200

          sm:rounded-full sm:text-[15px]

          ${
            purchased
              ? "cursor-default bg-[#e8f7ee] text-[#147a42]"
              : inStock
              ? `
                  bg-[#0071e3] text-white
                  shadow-[0_4px_12px_rgba(0,113,227,0.18)]
                  hover:bg-[#0077ed]
                  hover:shadow-[0_6px_18px_rgba(0,113,227,0.25)]
                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:bg-[#f5f5f7]
                  disabled:text-[#86868b]
                  disabled:shadow-none
                `
              : `
                  cursor-not-allowed
                  bg-[#f5f5f7]
                  text-[#86868b]
                `
          }
        `}
      >
        {/* Purchased */}
        {purchased && (
          <svg
            className="h-[18px] w-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}

        {/* Loading */}
        {purchasing && !purchased && (
          <svg
            className="h-[18px] w-[18px] animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-30"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
            />

            <path
              d="M21 12a9 9 0 00-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Cart */}
        {!purchased && !purchasing && inStock && (
          <svg
            className="h-[18px] w-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.9}
              d="M3 3h2l2.4 10.2a2 2 0 002 1.55h7.8a2 2 0 001.95-1.55L21 6H6"
            />

            <circle cx="10" cy="19" r="1" fill="currentColor" />
            <circle cx="18" cy="19" r="1" fill="currentColor" />
          </svg>
        )}

        {/* Button Text */}
        {purchased
          ? "Purchased"
          : purchasing
          ? "Purchasing..."
          : inStock
          ? "Purchase Vehicle"
          : "Out of Stock"}
      </button>
    </article>
  );
};

export default VehicleCard;