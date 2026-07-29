import { useState } from "react";

const SearchBar = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      make: "",
      model: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    };

    setFilters(emptyFilters);

    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl bg-white p-5 shadow"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <input
          type="text"
          name="make"
          value={filters.make}
          onChange={handleChange}
          placeholder="Make"
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />

        <input
          type="text"
          name="model"
          value={filters.model}
          onChange={handleChange}
          placeholder="Model"
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />

        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Category"
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />

        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min price"
          min="0"
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />

        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max price"
          min="0"
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />

      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg bg-gray-200 px-5 py-2 font-medium text-gray-700 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchBar;