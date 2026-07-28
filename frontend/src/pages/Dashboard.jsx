import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Vehicle Inventory
        </h1>

        <p className="mt-2 text-gray-600">
          Browse available vehicles.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;