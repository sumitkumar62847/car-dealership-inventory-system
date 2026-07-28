import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  console.log({
    user,
    isAuthenticated,
    isAdmin,
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Vehicle Dashboard
      </h1>
    </div>
  );
};

export default Dashboard;