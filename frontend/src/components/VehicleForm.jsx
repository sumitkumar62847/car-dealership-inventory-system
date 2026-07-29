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
    } else {
      setFormData(emptyForm);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      setError("All fields are required");
      return;
    }

    if (Number(formData.price) < 0) {
      setError("Price cannot be negative");
      return;
    }

    if (Number(formData.quantity) < 0) {
      setError("Quantity cannot be negative");
      return;
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    });
  };

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? "Update Vehicle" : "Add Vehicle"}
        </h2>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            name="make"
            value={formData.make}
            onChange={handleChange}
            placeholder="Make"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            type="number"
            name="quantity"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Vehicle"
            : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;