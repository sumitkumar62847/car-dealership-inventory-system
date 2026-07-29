import { useEffect, useRef, useState } from "react";
import { getVehicles } from "../services/api";

const FilterBar = ({ onSearch, onReset }) => {
  const [carData, setCarData] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [maxSliderPrice, setMaxSliderPrice] = useState(100000);
  const [loading, setLoading] = useState(true);

  // Which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState(null);

  const filterRef = useRef(null);

  const [filters, setFilters] = useState({
    make: [],
    model: [],
    category: [],
    minPrice: 0,
    maxPrice: 100000,
  });

  const availableBrands = Object.keys(carData).sort();

  const availableModels = [
    ...new Set(
      filters.make.reduce((acc, make) => {
        return [...acc, ...(carData[make] || [])];
      }, [])
    ),
  ].sort();


  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);

        const data = await getVehicles();
        const vehicles = data.vehicles || [];

        const map = {};
        const categoriesSet = new Set();

        let highestPrice = 0;

        vehicles.forEach((vehicle) => {
          if (vehicle.make) {
            if (!map[vehicle.make]) {
              map[vehicle.make] = new Set();
            }

            if (vehicle.model) {
              map[vehicle.make].add(vehicle.model);
            }
          }

          if (vehicle.category) {
            categoriesSet.add(vehicle.category);
          }

          const price = Number(vehicle.price);

          if (price > highestPrice) {
            highestPrice = price;
          }
        });

        const formattedCarData = {};

        Object.keys(map).forEach((make) => {
          formattedCarData[make] = Array.from(map[make]).sort();
        });

        const calculatedMaxPrice =
          highestPrice > 0 ? highestPrice : 100000;

        setCarData(formattedCarData);

        setAvailableCategories(
          Array.from(categoriesSet).sort()
        );

        setMaxSliderPrice(calculatedMaxPrice);

        setFilters((prev) => ({
          ...prev,
          maxPrice: calculatedMaxPrice,
        }));
      } catch (error) {
        console.error("Failed to load filter options", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);



  const handleBrandChange = (make) => {
    setFilters((prev) => {
      const isSelected = prev.make.includes(make);

      const newMakes = isSelected
        ? prev.make.filter((item) => item !== make)
        : [...prev.make, make];

      let newModels = prev.model;

      // Remove models belonging to removed brand
      if (isSelected) {
        const modelsToRemove = carData[make] || [];

        newModels = prev.model.filter(
          (model) => !modelsToRemove.includes(model)
        );
      }

      return {
        ...prev,
        make: newMakes,
        model: newModels,
      };
    });
  };



  const handleCheckboxChange = (type, value) => {
    setFilters((prev) => {
      const list = prev[type];

      const updatedList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

      return {
        ...prev,
        [type]: updatedList,
      };
    });
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    setOpenDropdown(null);

    const payload = {
      make: filters.make.join(","),
      model: filters.model.join(","),
      category: filters.category.join(","),

      minPrice:
        filters.minPrice > 0
          ? filters.minPrice.toString()
          : "",

      maxPrice:
        filters.maxPrice < maxSliderPrice
          ? filters.maxPrice.toString()
          : "",
    };

    onSearch(payload);
  };


  const handleReset = () => {
    setFilters({
      make: [],
      model: [],
      category: [],
      minPrice: 0,
      maxPrice: maxSliderPrice,
    });

    setOpenDropdown(null);

    onReset();
  };



  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };



  const hasActiveFilters =
    filters.make.length > 0 ||
    filters.model.length > 0 ||
    filters.category.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxSliderPrice;


  const Dropdown = ({
    id,
    title,
    count,
    disabled = false,
    children,
  }) => {
    const isOpen = openDropdown === id;

    return (
      <div className="relative w-full md:w-auto">

        {/* Trigger */}

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setOpenDropdown(isOpen ? null : id);
            }
          }}
          className={`
            flex w-full items-center justify-between
            rounded-xl px-4 py-3.5
            text-left transition-all
            md:min-w-[150px]
            md:rounded-none
            md:px-3
            md:py-2

            ${
              disabled
                ? "cursor-not-allowed bg-gray-50 text-gray-300 md:bg-transparent"
                : isOpen
                ? "bg-blue-50 text-[#0071e3] md:bg-transparent"
                : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-gray-100 md:bg-transparent"
            }
          `}
        >
          <div className="flex items-center gap-2">

            <span className="text-[14px] font-semibold">
              {title}
            </span>

            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0071e3] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}

          </div>

          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>

        </button>

        {/* Dropdown Content */}

        {isOpen && !disabled && (
          <div
            className="
              absolute left-0 top-[calc(100%+8px)] z-50
              w-full
              rounded-2xl
              border border-gray-100
              bg-white
              p-4
              shadow-[0_15px_45px_rgba(0,0,0,0.14)]

              md:w-[260px]
            "
          >
            <div className="max-h-[230px] overflow-y-auto pr-1">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };


  const CheckboxOption = ({
    checked,
    onChange,
    label,
  }) => (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50">

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="
          h-[18px] w-[18px]
          cursor-pointer
          accent-[#0071e3]
        "
      />

      <span className="text-[14px] font-medium text-[#515154]">
        {label}
      </span>

    </label>
  );


  if (loading) {
    return (
      <div className="mx-auto mb-8 flex justify-center px-4">
        <div className="rounded-full bg-white px-6 py-3 text-sm text-[#86868b] shadow-sm">
          Loading filters...
        </div>
      </div>
    );
  }


  return (
    <form
      ref={filterRef}
      onSubmit={handleSubmit}
      className="
        relative z-30
        mx-auto mb-10
        w-full
        max-w-[950px]
        px-4
      "
    >
      <div
        className="
          rounded-[24px]
          border border-gray-200/70
          bg-white
          p-4
          shadow-[0_12px_40px_rgba(0,0,0,0.08)]

          md:rounded-[28px]
          md:p-0
        "
      >


        <div
          className="
            flex flex-col gap-2

            md:flex-row
            md:items-center
            md:gap-0
            md:px-5
            md:py-4
          "
        >

          {/* Brand */}

          <Dropdown
            id="brand"
            title="Brand"
            count={filters.make.length}
          >
            {availableBrands.length === 0 ? (
              <p className="p-2 text-sm text-gray-400">
                No brands available
              </p>
            ) : (
              availableBrands.map((make) => (
                <CheckboxOption
                  key={make}
                  label={make}
                  checked={filters.make.includes(make)}
                  onChange={() =>
                    handleBrandChange(make)
                  }
                />
              ))
            )}
          </Dropdown>

          {/* Divider Desktop */}

          <div className="mx-2 hidden h-7 w-px bg-gray-200 md:block" />

          {/* Model */}

          <Dropdown
            id="model"
            title={
              filters.make.length === 0
                ? "Model · Select brand first"
                : "Model"
            }
            count={filters.model.length}
            disabled={filters.make.length === 0}
          >
            {availableModels.length === 0 ? (
              <p className="p-2 text-sm text-gray-400">
                No models available
              </p>
            ) : (
              availableModels.map((model) => (
                <CheckboxOption
                  key={model}
                  label={model}
                  checked={filters.model.includes(model)}
                  onChange={() =>
                    handleCheckboxChange(
                      "model",
                      model
                    )
                  }
                />
              ))
            )}
          </Dropdown>

          {/* Divider Desktop */}

          <div className="mx-2 hidden h-7 w-px bg-gray-200 md:block" />

          {/* Category */}

          <Dropdown
            id="category"
            title="Category"
            count={filters.category.length}
          >
            {availableCategories.length === 0 ? (
              <p className="p-2 text-sm text-gray-400">
                No categories available
              </p>
            ) : (
              availableCategories.map((category) => (
                <CheckboxOption
                  key={category}
                  label={category}
                  checked={filters.category.includes(
                    category
                  )}
                  onChange={() =>
                    handleCheckboxChange(
                      "category",
                      category
                    )
                  }
                />
              ))
            )}
          </Dropdown>

          {/* Desktop Search */}

          <button
            type="submit"
            aria-label="Search vehicles"
            className="
              ml-auto
              hidden
              h-12 w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#0071e3]
              text-white
              shadow-sm
              transition-all
              hover:bg-[#0077ed]
              hover:shadow-md
              active:scale-95

              md:flex
            "
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
                strokeWidth={2.3}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

        </div>

        {/* Desktop Divider */}

        <div className="hidden h-px bg-gray-100 md:block" />


        <div
          className="
            mt-5
            rounded-2xl
            bg-[#f8f8fa]
            p-4

            md:mt-0
            md:rounded-none
            md:bg-transparent
            md:px-7
            md:py-5
          "
        >

          {/* Price heading */}

          <div className="mb-4 flex items-center justify-between md:hidden">

            <span className="text-[14px] font-semibold text-[#1d1d1f]">
              Price range
            </span>

            <span className="text-[13px] font-medium text-[#0071e3]">
              {formatPrice(filters.minPrice)}
              {" – "}
              {formatPrice(filters.maxPrice)}
            </span>

          </div>

          <div className="flex items-center gap-3 md:gap-5">

            {/* Minimum */}

            <span className="hidden min-w-[65px] text-right text-[13px] font-medium text-[#86868b] md:block">
              {formatPrice(filters.minPrice)}
            </span>

            {/* Slider */}

            <div className="relative h-6 flex-1">

              {/* Background */}

              <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200" />

              {/* Active range */}

              <div
                className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#0071e3]"
                style={{
                  left: `${
                    (filters.minPrice /
                      maxSliderPrice) *
                    100
                  }%`,

                  right: `${
                    100 -
                    (filters.maxPrice /
                      maxSliderPrice) *
                      100
                  }%`,
                }}
              />

              {/* Minimum slider */}

              <input
                type="range"
                min="0"
                max={maxSliderPrice}
                step="1000"
                value={filters.minPrice}
                onChange={(event) => {
                  const value = Number(
                    event.target.value
                  );

                  setFilters((prev) => ({
                    ...prev,

                    minPrice: Math.min(
                      value,
                      prev.maxPrice - 1000
                    ),
                  }));
                }}
                className="
                  pointer-events-none
                  absolute
                  left-0 top-1/2
                  z-20
                  w-full
                  -translate-y-1/2
                  appearance-none
                  bg-transparent

                  [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:bg-[#0071e3]
                  [&::-webkit-slider-thumb]:shadow-md
                "
              />

              {/* Maximum slider */}

              <input
                type="range"
                min="0"
                max={maxSliderPrice}
                step="1000"
                value={filters.maxPrice}
                onChange={(event) => {
                  const value = Number(
                    event.target.value
                  );

                  setFilters((prev) => ({
                    ...prev,

                    maxPrice: Math.max(
                      value,
                      prev.minPrice + 1000
                    ),
                  }));
                }}
                className="
                  pointer-events-none
                  absolute
                  left-0 top-1/2
                  z-10
                  w-full
                  -translate-y-1/2
                  appearance-none
                  bg-transparent

                  [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:bg-[#0071e3]
                  [&::-webkit-slider-thumb]:shadow-md
                "
              />

            </div>

            {/* Maximum */}

            <span className="hidden min-w-[65px] text-[13px] font-medium text-[#86868b] md:block">
              {formatPrice(filters.maxPrice)}
              {filters.maxPrice ===
                maxSliderPrice && "+"}
            </span>

            {/* Desktop Clear */}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="
                  ml-auto
                  hidden
                  whitespace-nowrap
                  text-[13px]
                  font-medium
                  text-[#86868b]
                  transition-colors
                  hover:text-red-600

                  md:block
                "
              >
                Clear
              </button>
            )}

          </div>

          {/* Mobile price labels */}

          <div className="mt-1 flex justify-between md:hidden">
            <span className="text-[11px] text-gray-400">
              $0
            </span>

            <span className="text-[11px] text-gray-400">
              {formatPrice(maxSliderPrice)}+
            </span>
          </div>

        </div>


        <div className="mt-4 flex gap-2 md:hidden">

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="
                rounded-xl
                border border-gray-200
                px-5 py-3.5
                text-[14px]
                font-semibold
                text-[#515154]
                transition-colors
                hover:bg-gray-50
              "
            >
              Clear
            </button>
          )}

          <button
            type="submit"
            className="
              flex flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0071e3]
              px-5 py-3.5
              text-[14px]
              font-semibold
              text-white
              shadow-sm
              transition-all
              active:scale-[0.98]
            "
          >
            <svg
              className="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.3}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            Search vehicles
          </button>

        </div>

      </div>
    </form>
  );
};

export default FilterBar;