const Alert = ({ type = "error", children }) => {
  const styles =
    type === "success"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";

  return (
    <div
      className={`mb-6 rounded-xl border p-4 ${styles}`}
    >
      {children}
    </div>
  );
};

export default Alert;