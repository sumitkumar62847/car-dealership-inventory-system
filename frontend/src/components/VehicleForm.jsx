import { useEffect, useState } from "react";

const emptyForm = {
  make: "",
  model: "",
  category: "",
  price: "",
  quantity: "",
};

const VehicleForm = ({
  vehicle,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const isEditing = Boolean(vehicle);


  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || "",
        model: vehicle.model || "",
        category: vehicle.category || "",
        price: vehicle.price ?? "",
        quantity: vehicle.quantity ?? "",
      });

      // Automatically open form when editing
      setFormOpen(true);
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [vehicle]);


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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.make.trim() ||
      !formData.model.trim() ||
      !formData.category.trim() ||
      formData.price === "" ||
      formData.quantity === ""
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (Number(formData.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(formData.quantity) < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    onSubmit({
      ...formData,
      make: formData.make.trim(),
      model: formData.model.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    });
  };

  const handleCancel = () => {
    setError("");

    if (isEditing) {
      onCancel();
    }

    setFormData(emptyForm);
    setFormOpen(false);
  };

  const inputStyles = `
    w-full
    rounded-xl
    border border-gray-200
    bg-[#f8f8fa]
    px-4 py-3.5
    text-[15px]
    font-medium
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


  if (!formOpen && !isEditing) {
    return (
      <div
        className="
          flex flex-col gap-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Info */}
        <div>
          <div className="mb-2 flex items-center gap-2">

            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#0071e3]">
              Inventory Management
            </p>
          </div>

          <h2
            className="
              text-[21px]
              font-semibold
              tracking-[-0.02em]
              text-[#1d1d1f]

              sm:text-[23px]
            "
          >
            Add a new vehicle
          </h2>

          <p
            className="
              mt-1
              max-w-xl
              text-[13px]
              leading-5
              text-[#86868b]

              sm:text-[14px]
            "
          >
            Add a vehicle to your dealership inventory with its
            make, model, category, price and available quantity.
          </p>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="
            flex w-full
            shrink-0
            items-center justify-center
            gap-2
            rounded-xl
            bg-[#0071e3]
            px-6 py-3
            text-[14px]
            font-semibold
            text-white
            shadow-[0_4px_12px_rgba(0,113,227,0.18)]
            transition-all

            hover:bg-[#0077ed]
            hover:shadow-[0_6px_18px_rgba(0,113,227,0.22)]

            active:scale-[0.98]

            sm:w-auto
            sm:rounded-full
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
              strokeWidth={2}
              d="M12 5v14M5 12h14"
            />
          </svg>

          Add Vehicle
        </button>
      </div>
    );
  }



  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-[#0071e3]">
            {isEditing ? "Edit Inventory" : "New Vehicle"}
          </p>

          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-2xl">
            {isEditing ? "Update Vehicle" : "Add New Vehicle"}
          </h2>

          <p className="mt-1 text-[13px] text-[#86868b]">
            {isEditing
              ? "Update the vehicle information below."
              : "Enter the vehicle details to add it to your inventory."}
          </p>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          aria-label="Close form"
          className="
            flex h-9 w-9
            shrink-0
            items-center justify-center
            rounded-full
            bg-[#f5f5f7]
            text-[#515154]
            transition-colors

            hover:bg-gray-200
            hover:text-[#1d1d1f]

            disabled:cursor-not-allowed
            disabled:opacity-50
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
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            mb-5
            flex items-start gap-3
            rounded-xl
            border border-red-100
            bg-red-50
            px-4 py-3
          "
        >
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>

          <div>
            <p className="text-[13px] font-semibold text-red-700">
              Unable to save vehicle
            </p>

            <p className="mt-0.5 text-[12px] text-red-600">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Vehicle Information */}

        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] text-[#86868b]">
              Vehicle information
            </span>

            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Make */}
            <div>
              <label
                htmlFor="make"
                className="mb-1.5 block text-[13px] font-semibold text-[#515154]"
              >
                Make
              </label>

              <input
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Toyota"
                disabled={loading}
                className={inputStyles}
              />
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="mb-1.5 block text-[13px] font-semibold text-[#515154]"
              >
                Model
              </label>

              <input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Camry"
                disabled={loading}
                className={inputStyles}
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-[13px] font-semibold text-[#515154]"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Sedan"
                disabled={loading}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] text-[#86868b]">
              Pricing & inventory
            </span>

            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="mb-1.5 block text-[13px] font-semibold text-[#515154]"
              >
                Price
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]">
                  &#8377;
                </span>

                <input
                  id="price"
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="35000"
                  disabled={loading}
                  className={`${inputStyles} pl-8`}
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="mb-1.5 block text-[13px] font-semibold text-[#515154]"
              >
                Quantity
              </label>

              <div className="relative">
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="10"
                  disabled={loading}
                  className={`${inputStyles} pr-16`}
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#86868b]">
                  units
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}

        <div
          className="
            mt-7
            flex flex-col-reverse
            gap-2
            border-t border-gray-100
            pt-5

            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="
              rounded-xl
              border border-gray-200
              bg-white
              px-6 py-3
              text-[14px]
              font-semibold
              text-[#515154]
              transition-colors

              hover:bg-gray-50

              disabled:cursor-not-allowed
              disabled:opacity-50

              sm:rounded-full
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              flex
              items-center justify-center
              gap-2
              rounded-xl
              bg-[#0071e3]
              px-7 py-3
              text-[14px]
              font-semibold
              text-white
              transition-all

              hover:bg-[#0077ed]

              active:scale-[0.98]

              disabled:cursor-not-allowed
              disabled:bg-gray-200
              disabled:text-gray-400

              sm:rounded-full
            "
          >
            {loading && (
              <svg
                className="h-[17px] w-[17px] animate-spin"
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

            {!loading && !isEditing && (
              <span className="text-lg leading-none">+</span>
            )}

            {loading
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;