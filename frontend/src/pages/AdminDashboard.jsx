import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Manage vehicle inventory.
        </p>
      </main>
    </div>
  );
};

export default AdminDashboard;