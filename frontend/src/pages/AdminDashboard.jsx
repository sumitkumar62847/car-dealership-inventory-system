import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import VehicleForm from "../components/VehicleForm";
import Footer from "../components/Footer";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle,
} from "../services/api";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formResetKey, setFormResetKey] = useState(0);

  const [deletingId, setDeletingId] = useState(null);

  const [restockAmounts, setRestockAmounts] = useState({});
  const [restockingId, setRestockingId] = useState(null);

  const formSectionRef = useRef(null);


  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getVehicles();

        setVehicles(data.vehicles || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load vehicles"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);


  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };


  const handleAddVehicle = async (vehicleData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await createVehicle(vehicleData);

      setVehicles((current) => [
        ...current,
        data.vehicle,
      ]);

      showSuccess("Vehicle added successfully");

      // Reset and collapse VehicleForm
      setFormResetKey((key) => key + 1);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add vehicle"
      );
    } finally {
      setSaving(false);
    }
  };


  const handleUpdateVehicle = async (vehicleData) => {
    if (!selectedVehicle) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await updateVehicle(
        selectedVehicle._id,
        vehicleData
      );

      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle._id === selectedVehicle._id
            ? data.vehicle
            : vehicle
        )
      );

      setSelectedVehicle(null);

      showSuccess("Vehicle updated successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update vehicle"
      );
    } finally {
      setSaving(false);
    }
  };


  const handleVehicleSubmit = async (vehicleData) => {
    if (selectedVehicle) {
      await handleUpdateVehicle(vehicleData);
    } else {
      await handleAddVehicle(vehicleData);
    }
  };


  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setError("");
    setSuccess("");

    // Scroll to form
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };


  const handleDelete = async (vehicleId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(vehicleId);
      setError("");
      setSuccess("");

      await deleteVehicle(vehicleId);

      setVehicles((current) =>
        current.filter(
          (vehicle) => vehicle._id !== vehicleId
        )
      );

      if (selectedVehicle?._id === vehicleId) {
        setSelectedVehicle(null);
      }

      showSuccess("Vehicle deleted successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete vehicle"
      );
    } finally {
      setDeletingId(null);
    }
  };


  const handleRestockChange = (vehicleId, value) => {
    setRestockAmounts((current) => ({
      ...current,
      [vehicleId]: value,
    }));
  };


  const handleRestock = async (vehicleId) => {
    const quantity = Number(
      restockAmounts[vehicleId]
    );

    if (!quantity || quantity <= 0) {
      setError(
        "Restock quantity must be greater than 0"
      );
      return;
    }

    try {
      setRestockingId(vehicleId);
      setError("");
      setSuccess("");

      const data = await restockVehicle(
        vehicleId,
        quantity
      );

      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle._id === vehicleId
            ? data.vehicle
            : vehicle
        )
      );

      setRestockAmounts((current) => ({
        ...current,
        [vehicleId]: "",
      }));

      showSuccess("Vehicle restocked successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to restock vehicle"
      );
    } finally {
      setRestockingId(null);
    }
  };


  const totalModels = vehicles.length;

  const totalUnits = vehicles.reduce(
    (total, vehicle) =>
      total + Number(vehicle.quantity || 0),
    0
  );

  const inStockVehicles = vehicles.filter(
    (vehicle) => vehicle.quantity > 0
  ).length;

  const outOfStockVehicles =
    vehicles.filter(
      (vehicle) => vehicle.quantity <= 0
    ).length;


  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f7f8fa] font-sans text-[#1d1d1f] antialiased">

      <Navbar />

      <main
        className="
          mx-auto
          w-full
          max-w-[1400px]
          flex-1
          px-4
          pb-16
          pt-24

          sm:px-6
          sm:pb-20
          sm:pt-28

          lg:px-8
        "
      >
      

        <section className="mb-8 sm:mb-10">
          <div
            className="
              flex flex-col
              gap-4

              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0071e3]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0071e3] sm:text-[11px]">
                  Administration
                </span>
              </div>

              <h1
                className="
                  text-[30px]
                  font-semibold
                  tracking-[-0.035em]

                  sm:text-[38px]
                "
              >
                Inventory Management
              </h1>

              <p
                className="
                  mt-2
                  max-w-[620px]
                  text-[14px]
                  leading-6
                  text-[#86868b]

                  sm:text-[15px]
                "
              >
                Manage your dealership inventory,
                update vehicle information, restock
                units, and remove vehicles.
              </p>
            </div>
          </div>
        </section>


        {!loading && (
          <section
            className="
              mb-7
              grid grid-cols-2
              gap-3

              sm:mb-8
              sm:grid-cols-4
              sm:gap-4
            "
          >
            <StatCard
              label="Vehicle Models"
              value={totalModels}
              type="vehicles"
            />

            <StatCard
              label="Total Units"
              value={totalUnits}
              type="units"
            />

            <StatCard
              label="In Stock"
              value={inStockVehicles}
              type="stock"
            />

            <StatCard
              label="Out of Stock"
              value={outOfStockVehicles}
              type="out"
            />
          </section>
        )}


        {error && (
          <Notification
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        {success && (
          <Notification
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}


        <section
          ref={formSectionRef}
          className="
            mb-8
            rounded-[22px]
            border border-gray-200/70
            bg-white
            p-5
            shadow-[0_5px_25px_rgba(0,0,0,0.035)]

            sm:mb-10
            sm:rounded-[26px]
            sm:p-7
          "
        >
          <VehicleForm
            key={formResetKey}
            vehicle={selectedVehicle}
            onSubmit={handleVehicleSubmit}
            onCancel={() =>
              setSelectedVehicle(null)
            }
            loading={saving}
          />
        </section>


        {!loading && vehicles.length > 0 && (
          <div
            className="
              mb-5
              flex items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#0071e3]">
                Inventory
              </p>

              <h2
                className="
                  text-[22px]
                  font-semibold
                  tracking-[-0.02em]

                  sm:text-[26px]
                "
              >
                All Vehicles
              </h2>

              <p className="mt-1 text-[13px] text-[#86868b]">
                Manage your current vehicle stock.
              </p>
            </div>

            <span
              className="
                hidden
                rounded-full
                bg-gray-100
                px-3 py-1.5
                text-[12px]
                font-semibold
                text-[#515154]

                sm:inline-flex
              "
            >
              {vehicles.length}{" "}
              {vehicles.length === 1
                ? "vehicle"
                : "vehicles"}
            </span>
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
            <div
              className="
                h-8 w-8
                animate-spin
                rounded-full
                border-[3px]
                border-gray-200
                border-t-[#0071e3]
              "
            />

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
                rounded-[24px]
                border border-gray-200/70
                bg-white
                px-6 py-14
                text-center
              "
            >
              <div
                className="
                  mx-auto mb-5
                  flex h-14 w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-50
                  text-[#0071e3]
                "
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 5v14M5 12h14"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold">
                Your inventory is empty
              </h2>

              <p
                className="
                  mx-auto mt-2
                  max-w-sm
                  text-[13px]
                  leading-6
                  text-[#86868b]
                "
              >
                Add your first vehicle using the
                inventory form above.
              </p>
            </div>
          )}


        {!loading &&
          !error &&
          vehicles.length > 0 && (
            <div className="space-y-3 md:hidden">
              {vehicles.map((vehicle) => (
                <MobileVehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  restockValue={
                    restockAmounts[vehicle._id] || ""
                  }
                  restocking={
                    restockingId === vehicle._id
                  }
                  deleting={
                    deletingId === vehicle._id
                  }
                  onEdit={() => handleEdit(vehicle)}
                  onDelete={() =>
                    handleDelete(vehicle._id)
                  }
                  onRestock={() =>
                    handleRestock(vehicle._id)
                  }
                  onRestockChange={(value) =>
                    handleRestockChange(
                      vehicle._id,
                      value
                    )
                  }
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}


        {!loading &&
          !error &&
          vehicles.length > 0 && (
            <div
              className="
                hidden
                overflow-hidden
                rounded-[24px]
                border border-gray-200/70
                bg-white
                shadow-[0_5px_25px_rgba(0,0,0,0.035)]

                md:block
              "
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse">

                  {/* HEADER */}

                  <thead>
                    <tr className="border-b border-gray-100 bg-[#fafafa]">
                      <th className={tableHeaderStyles}>
                        Vehicle
                      </th>

                      <th className={tableHeaderStyles}>
                        Category
                      </th>

                      <th className={tableHeaderStyles}>
                        Price
                      </th>

                      <th className={tableHeaderStyles}>
                        Stock
                      </th>

                      <th className={tableHeaderStyles}>
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#86868b]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* BODY */}

                  <tbody className="divide-y divide-gray-100">
                    {vehicles.map((vehicle) => {
                      const inStock =
                        vehicle.quantity > 0;

                      return (
                        <tr
                          key={vehicle._id}
                          className="
                            transition-colors
                            hover:bg-[#fafafa]/70
                          "
                        >
                          {/* Vehicle */}

                          <td className="px-5 py-5">
                            <div>
                              <p className="text-[14px] font-semibold text-[#1d1d1f]">
                                {vehicle.make}{" "}
                                {vehicle.model}
                              </p>

                              <p className="mt-0.5 text-[11px] text-[#86868b]">
                                ID:{" "}
                                {vehicle._id
                                  ?.slice(-6)
                                  .toUpperCase()}
                              </p>
                            </div>
                          </td>

                          {/* Category */}

                          <td className="px-5 py-5">
                            <span
                              className="
                                inline-flex
                                rounded-lg
                                bg-[#f5f5f7]
                                px-2.5 py-1
                                text-[12px]
                                font-medium
                                text-[#515154]
                              "
                            >
                              {vehicle.category}
                            </span>
                          </td>

                          {/* Price */}

                          <td className="px-5 py-5 text-[14px] font-semibold">
                            {formatPrice(
                              vehicle.price
                            )}
                          </td>

                          {/* Quantity */}

                          <td className="px-5 py-5">
                            <span className="text-[14px] font-semibold">
                              {vehicle.quantity}
                            </span>

                            <span className="ml-1 text-[11px] text-[#86868b]">
                              units
                            </span>
                          </td>

                          {/* Status */}

                          <td className="px-5 py-5">
                            <StockBadge
                              inStock={inStock}
                            />
                          </td>

                          {/* Actions */}

                          <td className="px-5 py-5">
                            <div className="flex items-center justify-end gap-2">

                              {/* Edit */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(vehicle)
                                }
                                className="
                                  rounded-lg
                                  bg-[#f5f5f7]
                                  px-3 py-2
                                  text-[12px]
                                  font-semibold
                                  text-[#515154]
                                  transition-colors

                                  hover:bg-gray-200
                                  hover:text-[#1d1d1f]
                                "
                              >
                                Edit
                              </button>

                              {/* Restock */}

                              <div
                                className="
                                  flex items-center
                                  rounded-lg
                                  border border-gray-200
                                  bg-white
                                  p-1
                                "
                              >
                                <input
                                  type="number"
                                  min="1"
                                  value={
                                    restockAmounts[
                                      vehicle._id
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleRestockChange(
                                      vehicle._id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Qty"
                                  className="
                                    w-[58px]
                                    bg-transparent
                                    px-2
                                    text-center
                                    text-[12px]
                                    font-medium
                                    outline-none
                                  "
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRestock(
                                      vehicle._id
                                    )
                                  }
                                  disabled={
                                    restockingId ===
                                    vehicle._id
                                  }
                                  className="
                                    rounded-md
                                    bg-[#0071e3]
                                    px-3 py-1.5
                                    text-[11px]
                                    font-semibold
                                    text-white
                                    transition-colors

                                    hover:bg-[#0077ed]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                  "
                                >
                                  {restockingId ===
                                  vehicle._id
                                    ? "..."
                                    : "Restock"}
                                </button>
                              </div>

                              {/* Delete */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    vehicle._id
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  vehicle._id
                                }
                                className="
                                  flex h-8 w-8
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-[#cc292b]
                                  transition-colors

                                  hover:bg-red-50

                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                "
                                aria-label="Delete vehicle"
                              >
                                {deletingId ===
                                vehicle._id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                                ) : (
                                  <TrashIcon />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
};


const tableHeaderStyles =
  "px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#86868b]";


const StatCard = ({ label, value, type }) => {
  const icons = {
    vehicles: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 16l1.5-5h13L20 16M6 16v2m12-2v2M7 11l1.5-4h7L17 11"
      />
    ),

    units: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 7l8-4 8 4-8 4-8-4zm0 5l8 4 8-4M4 17l8 4 8-4"
      />
    ),

    stock: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    ),

    out: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M6 18L18 6M6 6l12 12"
      />
    ),
  };

  return (
    <div
      className="
        rounded-[18px]
        border border-gray-200/70
        bg-white
        p-4

        sm:rounded-[20px]
        sm:p-5
      "
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-[#86868b] sm:text-[12px]">
            {label}
          </p>

          <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] sm:text-[28px]">
            {value}
          </p>
        </div>

        <div
          className={`
            flex h-9 w-9
            items-center
            justify-center
            rounded-xl

            ${
              type === "out"
                ? "bg-red-50 text-red-500"
                : type === "stock"
                ? "bg-green-50 text-green-600"
                : "bg-blue-50 text-[#0071e3]"
            }
          `}
        >
          <svg
            className="h-[18px] w-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {icons[type]}
          </svg>
        </div>
      </div>
    </div>
  );
};


const Notification = ({
  type,
  message,
  onClose,
}) => {
  const success = type === "success";

  return (
    <div
      className={`
        mb-6
        flex items-center
        gap-3
        rounded-xl
        border
        px-4 py-3

        ${
          success
            ? "border-green-100 bg-green-50 text-green-700"
            : "border-red-100 bg-red-50 text-red-700"
        }
      `}
    >
      <div
        className={`
          flex h-7 w-7
          shrink-0
          items-center
          justify-center
          rounded-full

          ${
            success
              ? "bg-green-100"
              : "bg-red-100"
          }
        `}
      >
        {success ? (
          <svg
            className="h-4 w-4"
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
        ) : (
          <span className="text-sm font-bold">
            !
          </span>
        )}
      </div>

      <p className="flex-1 text-[13px] font-medium">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="text-lg leading-none opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
};


const StockBadge = ({ inStock }) => (
  <span
    className={`
      inline-flex
      items-center
      gap-1.5
      rounded-full
      px-2.5 py-1
      text-[11px]
      font-semibold

      ${
        inStock
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-600"
      }
    `}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        inStock
          ? "bg-green-500"
          : "bg-red-500"
      }`}
    />

    {inStock ? "In Stock" : "Out of Stock"}
  </span>
);

const MobileVehicleCard = ({
  vehicle,
  restockValue,
  restocking,
  deleting,
  onEdit,
  onDelete,
  onRestock,
  onRestockChange,
  formatPrice,
}) => {
  const inStock = vehicle.quantity > 0;

  return (
    <article
      className="
        rounded-[20px]
        border border-gray-200/70
        bg-white
        p-5
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#86868b]">
            {vehicle.category}
          </p>

          <h3 className="mt-1 truncate text-[19px] font-semibold tracking-tight">
            {vehicle.make} {vehicle.model}
          </h3>
        </div>

        <StockBadge inStock={inStock} />
      </div>

      {/* Info */}

      <div
        className="
          my-5
          grid grid-cols-2
          divide-x divide-gray-100
          rounded-xl
          bg-[#f8f8fa]
          px-4 py-3
        "
      >
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#86868b]">
            Price
          </p>

          <p className="mt-1 text-[15px] font-semibold">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        <div className="pl-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#86868b]">
            Stock
          </p>

          <p className="mt-1 text-[15px] font-semibold">
            {vehicle.quantity}{" "}
            <span className="text-[11px] font-normal text-[#86868b]">
              units
            </span>
          </p>
        </div>
      </div>

      {/* Restock */}

      <div className="mb-3">
        <p className="mb-2 text-[11px] font-semibold text-[#515154]">
          Add stock
        </p>

        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={restockValue}
            onChange={(e) =>
              onRestockChange(e.target.value)
            }
            placeholder="Enter quantity"
            className="
              min-w-0 flex-1
              rounded-xl
              border border-gray-200
              bg-[#f8f8fa]
              px-4 py-3
              text-[13px]
              font-medium
              outline-none
              transition-all

              focus:border-[#0071e3]
              focus:bg-white
              focus:ring-4
              focus:ring-blue-50
            "
          />

          <button
            type="button"
            onClick={onRestock}
            disabled={restocking}
            className="
              rounded-xl
              bg-[#0071e3]
              px-4
              text-[13px]
              font-semibold
              text-white

              disabled:opacity-50
            "
          >
            {restocking ? "..." : "Restock"}
          </button>
        </div>
      </div>

      {/* Actions */}

      <div className="flex gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="
            flex-1
            rounded-xl
            bg-[#f5f5f7]
            py-3
            text-[13px]
            font-semibold
            text-[#515154]
          "
        >
          Edit Vehicle
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="
            flex h-[44px] w-[44px]
            items-center
            justify-center
            rounded-xl
            bg-red-50
            text-red-600

            disabled:opacity-50
          "
          aria-label="Delete vehicle"
        >
          {deleting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
          ) : (
            <TrashIcon />
          )}
        </button>
      </div>
    </article>
  );
};


const TrashIcon = () => (
  <svg
    className="h-[17px] w-[17px]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M6 7h12m-10 0l1 12h6l1-12M9 7V4h6v3"
    />
  </svg>
);

export default AdminDashboard;