import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import VehicleForm from "../components/VehicleForm";
import { getVehicles,createVehicle, updateVehicle, } from "../services/api";


const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] =
    useState(null);

    const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formResetKey, setFormResetKey] = useState(0);

  const handleAddVehicle = async (vehicleData) => {
    try {
        setSaving(true);
        setError("");

        const data = await createVehicle(vehicleData);

        setVehicles((currentVehicles) => [
        ...currentVehicles,
        data.vehicle,
        ]);

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
        if (!selectedVehicle) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            const data = await updateVehicle(
            selectedVehicle._id,
            vehicleData
            );

            setVehicles((currentVehicles) =>
            currentVehicles.map((vehicle) =>
                vehicle._id === selectedVehicle._id
                ? data.vehicle
                : vehicle
            )
            );

            setSelectedVehicle(null);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <VehicleForm
            key={formResetKey}
            vehicle={selectedVehicle}
            onSubmit={handleVehicleSubmit}
            onCancel={() => setSelectedVehicle(null)}
            loading={saving}
            />

          <p className="mt-2 text-gray-600">
            Manage dealership vehicle inventory.
          </p>
        </div>

        {loading && (
          <p className="text-gray-600">
            Loading inventory...
          </p>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          vehicles.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center shadow">
              <h2 className="text-xl font-semibold text-gray-700">
                No vehicles in inventory
              </h2>

              <p className="mt-2 text-gray-500">
                Add your first vehicle to get started.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          vehicles.length > 0 && (
            <div className="overflow-x-auto rounded-xl bg-white shadow">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-900 text-left text-white">
                  <tr>
                    <th className="px-6 py-4">
                      Make
                    </th>

                    <th className="px-6 py-4">
                      Model
                    </th>

                    <th className="px-6 py-4">
                      Category
                    </th>

                    <th className="px-6 py-4">
                      Price
                    </th>

                    <th className="px-6 py-4">
                      Stock
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle._id}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {vehicle.make}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {vehicle.model}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {vehicle.category}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        $
                        {Number(
                          vehicle.price
                        ).toLocaleString("en-US")}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {vehicle.quantity}
                      </td>

                      <td className="px-6 py-4">
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
                      </td>

                      <td className="px-6 py-4">
                        <button
                            type="button"
                            onClick={() => setSelectedVehicle(vehicle)}
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </main>
    </div>
  );
};

export default AdminDashboard;