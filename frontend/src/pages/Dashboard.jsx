import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getVehicles,
  searchVehicles,
  purchaseVehicle,
} from "../services/api";

import SearchBar from "../components/SearchBar";
import VehicleCard from "../components/VehicleCard";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasingId, setPurchasingId] = useState(null);

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
    } catch (error) {
        setError(
        error.response?.data?.message ||
            "Failed to search vehicles"
        );
    } finally {
        setLoading(false);
    }
    };

    const handleReset = async () => {
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
        } catch (error) {
            setError(
            error.response?.data?.message ||
                "Failed to purchase vehicle"
            );
        } finally {
            setPurchasingId(null);
        }
    };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Vehicle Inventory
          </h1>

          <p className="mt-2 text-gray-600">
            Browse our available vehicles.
          </p>
        </div>

        <SearchBar
        onSearch={handleSearch}
        onReset={handleReset}
        />

        {loading && (
          <p className="text-gray-600">
            Loading vehicles...
          </p>
        )}

        {error && (
          <div className="rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          vehicles.length === 0 && (
            <div className="rounded-lg bg-white p-8 text-center shadow">
              <h2 className="text-xl font-semibold text-gray-700">
                No vehicles available
              </h2>

              <p className="mt-2 text-gray-500">
                Please check back later.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          vehicles.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    onPurchase={handlePurchase}
                    purchasing={
                                purchasingId === vehicle._id
                            }
                />
                ))}
            </div>
          )}
      </main>
    </div>
  );
};

export default Dashboard;