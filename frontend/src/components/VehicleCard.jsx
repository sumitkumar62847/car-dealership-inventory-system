const VehicleCard = ({ vehicle,onPurchase,purchasing, }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {vehicle.make} {vehicle.model}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {vehicle.category}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            vehicle.quantity > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {vehicle.quantity > 0
            ? "In Stock"
            : "Out of Stock"}
        </span>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Price
          </span>

          <span className="font-semibold text-gray-800">
            $
            {Number(vehicle.price).toLocaleString(
              "en-US"
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Quantity
          </span>

          <span className="font-semibold text-gray-800">
            {vehicle.quantity}
          </span>
        </div>
        <button
            type="button"
            onClick={() => onPurchase(vehicle._id)}
            disabled={
                vehicle.quantity === 0 ||
                purchasing
            }
            className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
            {purchasing
                ? "Purchasing..."
                : vehicle.quantity === 0
                ? "Out of Stock"
                : "Purchase"}
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;