import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Dashboard from "./Dashboard";

import {
  getVehicles,
  searchVehicles,
  purchaseVehicle,
} from "../services/api";

// --------------------
// Mock API
// --------------------

jest.mock("../services/api", () => ({
  getVehicles: jest.fn(),
  searchVehicles: jest.fn(),
  purchaseVehicle: jest.fn(),
}));

// --------------------
// Mock child components
// --------------------

jest.mock("../components/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock("../components/Footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock("../components/LoadingSpinner", () => {
  return function MockLoadingSpinner() {
    return (
      <div data-testid="loading-spinner">
        Loading Spinner
      </div>
    );
  };
});

/*
  We mock SearchBar because SearchBar itself
  already has its own test file.

  These buttons allow us to trigger Dashboard's
  onSearch and onReset functions.
*/
jest.mock("../components/SearchBar", () => {
  return function MockSearchBar({
    onSearch,
    onReset,
  }) {
    return (
      <div data-testid="search-bar">
        <button
          onClick={() =>
            onSearch({
              make: "Toyota",
              model: "",
              category: "SUV",
              minPrice: "",
              maxPrice: "50000",
            })
          }
        >
          Test Search
        </button>

        <button onClick={onReset}>
          Test Reset
        </button>
      </div>
    );
  };
});

/*
  VehicleCard already has separate component tests.
  Here we only need to verify Dashboard passes
  correct vehicle/purchase state to it.
*/
jest.mock("../components/VehicleCard", () => {
  return function MockVehicleCard({
    vehicle,
    onPurchase,
    purchasing,
    purchased,
  }) {
    return (
      <div data-testid={`vehicle-${vehicle._id}`}>
        <span>
          {vehicle.make} {vehicle.model}
        </span>

        <span>
          Quantity: {vehicle.quantity}
        </span>

        {purchasing && (
          <span>Purchasing...</span>
        )}

        {purchased && (
          <span>Purchased!</span>
        )}

        <button
          onClick={() =>
            onPurchase(vehicle._id)
          }
        >
          Purchase {vehicle.make}
        </button>
      </div>
    );
  };
});

// --------------------
// Test data
// --------------------

const vehicles = [
  {
    _id: "vehicle-1",
    make: "Toyota",
    model: "Fortuner",
    category: "SUV",
    price: 45000,
    quantity: 5,
  },
  {
    _id: "vehicle-2",
    make: "Honda",
    model: "Civic",
    category: "Sedan",
    price: 30000,
    quantity: 3,
  },
];

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------
  // Initial loading
  // --------------------

  test("shows loading state while vehicles are being fetched", () => {
    getVehicles.mockReturnValue(
      new Promise(() => {})
    );

    render(<Dashboard />);

    expect(
      screen.getByTestId("loading-spinner")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/loading inventory/i)
    ).toBeInTheDocument();
  });

  // --------------------
  // Fetch vehicles
  // --------------------

  test("loads and displays vehicles", async () => {
    getVehicles.mockResolvedValue({
      vehicles,
    });

    render(<Dashboard />);

    expect(
      await screen.findByText(
        "Toyota Fortuner"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Honda Civic")
    ).toBeInTheDocument();

    expect(
      screen.getByText("2 vehicles")
    ).toBeInTheDocument();

    expect(getVehicles).toHaveBeenCalledTimes(1);
  });

  test("shows singular vehicle count for one vehicle", async () => {
    getVehicles.mockResolvedValue({
      vehicles: [vehicles[0]],
    });

    render(<Dashboard />);

    expect(
      await screen.findByText("1 vehicle")
    ).toBeInTheDocument();
  });

  // --------------------
  // Empty inventory
  // --------------------

  test("shows empty inventory message when no vehicles exist", async () => {
    getVehicles.mockResolvedValue({
      vehicles: [],
    });

    render(<Dashboard />);

    expect(
      await screen.findByRole("heading", {
        name: /no vehicles available/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /there are currently no vehicles in the inventory/i
      )
    ).toBeInTheDocument();
  });

  /*
    Your component uses:
      setVehicles(data.vehicles || [])

    So we should also verify missing vehicles
    becomes an empty array.
  */
  test("handles missing vehicles property as empty inventory", async () => {
    getVehicles.mockResolvedValue({});

    render(<Dashboard />);

    expect(
      await screen.findByText(
        /no vehicles available/i
      )
    ).toBeInTheDocument();
  });

  // --------------------
  // Initial API error
  // --------------------

  test("shows API error when loading vehicles fails", async () => {
    getVehicles.mockRejectedValue({
      response: {
        data: {
          message:
            "Unable to retrieve inventory",
        },
      },
    });

    render(<Dashboard />);

    expect(
      await screen.findByText(
        "Unable to retrieve inventory"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /something went wrong/i
      )
    ).toBeInTheDocument();
  });

  test("shows fallback error when loading vehicles fails without API message", async () => {
    getVehicles.mockRejectedValue(
      new Error("Network Error")
    );

    render(<Dashboard />);

    expect(
      await screen.findByText(
        /failed to load vehicles\. please try again\./i
      )
    ).toBeInTheDocument();
  });

  // --------------------
  // Search
  // --------------------

  test("searches vehicles using cleaned filters", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    searchVehicles.mockResolvedValue({
      vehicles: [vehicles[0]],
    });

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    await user.click(
      screen.getByRole("button", {
        name: /test search/i,
      })
    );

    await waitFor(() => {
      expect(searchVehicles).toHaveBeenCalledWith({
        make: "Toyota",
        category: "SUV",
        maxPrice: "50000",
      });
    });

    expect(
      await screen.findByText("1 vehicle")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Honda Civic")
    ).not.toBeInTheDocument();
  });

  test("shows search empty state when no vehicles match", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    searchVehicles.mockResolvedValue({
      vehicles: [],
    });

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    await user.click(
      screen.getByRole("button", {
        name: /test search/i,
      })
    );

    expect(
      await screen.findByRole("heading", {
        name: /no vehicles match your search/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /try changing your brand, model, category, or price range/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /clear all filters/i,
      })
    ).toBeInTheDocument();
  });

  test("shows API error when search fails", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    searchVehicles.mockRejectedValue({
      response: {
        data: {
          message: "Search failed",
        },
      },
    });

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    await user.click(
      screen.getByRole("button", {
        name: /test search/i,
      })
    );

    expect(
      await screen.findByText("Search failed")
    ).toBeInTheDocument();
  });

  test("shows fallback error when search fails without API message", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    searchVehicles.mockRejectedValue(
      new Error("Network Error")
    );

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    await user.click(
      screen.getByRole("button", {
        name: /test search/i,
      })
    );

    expect(
      await screen.findByText(
        /failed to search vehicles/i
      )
    ).toBeInTheDocument();
  });

  // --------------------
  // Reset
  // --------------------

  test("clears search and fetches all vehicles again", async () => {
    const user = userEvent.setup();

    getVehicles
      .mockResolvedValueOnce({
        vehicles,
      })
      .mockResolvedValueOnce({
        vehicles,
      });

    searchVehicles.mockResolvedValue({
      vehicles: [],
    });

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    // Search -> no results
    await user.click(
      screen.getByRole("button", {
        name: /test search/i,
      })
    );

    const clearButton =
      await screen.findByRole("button", {
        name: /clear all filters/i,
      });

    await user.click(clearButton);

    await waitFor(() => {
      expect(getVehicles).toHaveBeenCalledTimes(2);
    });

    expect(
      await screen.findByText(
        "Toyota Fortuner"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Honda Civic")
    ).toBeInTheDocument();
  });

  // --------------------
  // Purchase
  // --------------------

  test("purchases vehicle and updates its quantity", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    purchaseVehicle.mockResolvedValue({
      vehicle: {
        ...vehicles[0],
        quantity: 4,
      },
    });

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    expect(
      screen.getByText("Quantity: 5")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /purchase toyota/i,
      })
    );

    expect(
      purchaseVehicle
    ).toHaveBeenCalledWith("vehicle-1");

    expect(
      await screen.findByText("Quantity: 4")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Purchased!")
    ).toBeInTheDocument();
  });

  test("shows purchasing state while purchase request is pending", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    purchaseVehicle.mockReturnValue(
      new Promise(() => {})
    );

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    await user.click(
      screen.getByRole("button", {
        name: /purchase toyota/i,
      })
    );

    expect(
      await screen.findByText(
        "Purchasing..."
      )
    ).toBeInTheDocument();
  });

  test("shows API error when purchase fails", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    purchaseVehicle.mockRejectedValue({
      response: {
        data: {
          message: "Vehicle out of stock",
        },
      },
    });

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    await user.click(
      screen.getByRole("button", {
        name: /purchase toyota/i,
      })
    );

    expect(
      await screen.findByText(
        "Vehicle out of stock"
      )
    ).toBeInTheDocument();
  });

  test("shows fallback error when purchase fails without API message", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    purchaseVehicle.mockRejectedValue(
      new Error("Network Error")
    );

    render(<Dashboard />);

    await screen.findByText(
      "Toyota Fortuner"
    );

    await user.click(
      screen.getByRole("button", {
        name: /purchase toyota/i,
      })
    );

    expect(
      await screen.findByText(
        /failed to purchase vehicle/i
      )
    ).toBeInTheDocument();
  });

  // --------------------
  // Layout dependencies
  // --------------------

  test("renders navbar, search bar and footer", async () => {
    getVehicles.mockResolvedValue({
      vehicles: [],
    });

    render(<Dashboard />);

    await screen.findByText(
      /no vehicles available/i
    );

    expect(
      screen.getByTestId("navbar")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("search-bar")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("footer")
    ).toBeInTheDocument();
  });
});