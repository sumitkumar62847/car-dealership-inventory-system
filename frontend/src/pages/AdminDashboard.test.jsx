import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AdminDashboard from "./AdminDashboard";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle,
} from "../services/api";

// ================================
// Mock API
// ================================

jest.mock("../services/api", () => ({
  getVehicles: jest.fn(),
  createVehicle: jest.fn(),
  updateVehicle: jest.fn(),
  deleteVehicle: jest.fn(),
  restockVehicle: jest.fn(),
}));

// ================================
// Mock layout components
// ================================

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

// ================================
// Mock VehicleForm
// ================================

jest.mock("../components/VehicleForm", () => {
  return function MockVehicleForm({
    vehicle,
    onSubmit,
    onCancel,
    loading,
  }) {
    return (
      <div data-testid="vehicle-form">
        <p>
          {vehicle
            ? `Editing: ${vehicle.make} ${vehicle.model}`
            : "Add Vehicle Form"}
        </p>

        {loading && <p>Saving...</p>}

        <button
          type="button"
          onClick={() =>
            onSubmit({
              make: vehicle?.make || "BMW",
              model: vehicle?.model || "X5",
              category: vehicle?.category || "SUV",
              price: vehicle?.price || 70000,
              quantity: vehicle?.quantity || 4,
            })
          }
        >
          Submit Vehicle
        </button>

        {vehicle && (
          <button
            type="button"
            onClick={onCancel}
          >
            Cancel Edit
          </button>
        )}
      </div>
    );
  };
});

// ================================
// Test Data
// ================================

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
    quantity: 0,
  },
];

describe("AdminDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // jsdom may not implement this
    window.HTMLElement.prototype.scrollIntoView =
      jest.fn();
  });

  // =====================================
  // 1. Loading
  // =====================================

  test("shows loading state while vehicles are being fetched", () => {
    getVehicles.mockReturnValue(
      new Promise(() => {})
    );

    render(<AdminDashboard />);

    expect(
      screen.getByText(/loading inventory/i)
    ).toBeInTheDocument();
  });

  // =====================================
  // 2. Fetch Vehicles
  // =====================================

  test("loads and displays vehicles", async () => {
    getVehicles.mockResolvedValue({
      vehicles,
    });

    render(<AdminDashboard />);

    expect(
      await screen.findAllByText(
        /toyota fortuner/i
      )
    ).not.toHaveLength(0);

    expect(
      screen.getAllByText(/honda civic/i)
    ).not.toHaveLength(0);

    expect(getVehicles).toHaveBeenCalledTimes(1);
  });

  // =====================================
  // 3. Statistics
  // =====================================
// =====================================
// 3. Statistics
// =====================================

test("calculates inventory statistics correctly", async () => {
  getVehicles.mockResolvedValue({
    vehicles,
  });

  render(<AdminDashboard />);

  // Wait until vehicle data has loaded
  await screen.findAllByText(/toyota fortuner/i);

  // -----------------------------
  // Vehicle Models
  // -----------------------------

  const vehicleModelsLabel =
    screen.getByText("Vehicle Models");

  expect(vehicleModelsLabel).toBeInTheDocument();

  expect(
    vehicleModelsLabel.parentElement
  ).toHaveTextContent("2");

  // -----------------------------
  // Total Units
  // -----------------------------

  const totalUnitsLabel =
    screen.getByText("Total Units");

  expect(totalUnitsLabel).toBeInTheDocument();

  expect(
    totalUnitsLabel.parentElement
  ).toHaveTextContent("5");

  // -----------------------------
  // In Stock
  // -----------------------------
  // "In Stock" appears multiple times:
  // statistics card + vehicle badges.
  // The statistics label is a <p>.

  const inStockLabels =
    screen.getAllByText("In Stock");

  const inStockStatLabel =
    inStockLabels.find(
      (element) => element.tagName === "P"
    );

  expect(inStockStatLabel).toBeDefined();

  expect(
    inStockStatLabel.parentElement
  ).toHaveTextContent("1");



  const outOfStockLabels =
    screen.getAllByText("Out of Stock");

  const outOfStockStatLabel =
    outOfStockLabels.find(
      (element) => element.tagName === "P"
    );

  expect(outOfStockStatLabel).toBeDefined();

  expect(
    outOfStockStatLabel.parentElement
  ).toHaveTextContent("1");
});

  // =====================================
  // 4. Empty Inventory
  // =====================================

  test("shows empty inventory state", async () => {
    getVehicles.mockResolvedValue({
      vehicles: [],
    });

    render(<AdminDashboard />);

    expect(
      await screen.findByRole("heading", {
        name: /your inventory is empty/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /add your first vehicle/i
      )
    ).toBeInTheDocument();
  });

  // =====================================
  // 5. Fetch Error
  // =====================================

  test("shows API error when loading vehicles fails", async () => {
    getVehicles.mockRejectedValue({
      response: {
        data: {
          message: "Unable to load inventory",
        },
      },
    });

    render(<AdminDashboard />);

    expect(
      await screen.findByText(
        "Unable to load inventory"
      )
    ).toBeInTheDocument();
  });

  test("shows fallback fetch error", async () => {
    getVehicles.mockRejectedValue(
      new Error("Network Error")
    );

    render(<AdminDashboard />);

    expect(
      await screen.findByText(
        "Failed to load vehicles"
      )
    ).toBeInTheDocument();
  });

  // =====================================
  // 6. Add Vehicle
  // =====================================

  test("adds a new vehicle", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles: [],
    });

    createVehicle.mockResolvedValue({
      vehicle: {
        _id: "vehicle-3",
        make: "BMW",
        model: "X5",
        category: "SUV",
        price: 70000,
        quantity: 4,
      },
    });

    render(<AdminDashboard />);

    await screen.findByText(
      /your inventory is empty/i
    );

    await user.click(
      screen.getByRole("button", {
        name: /submit vehicle/i,
      })
    );

    await waitFor(() => {
      expect(createVehicle).toHaveBeenCalledWith({
        make: "BMW",
        model: "X5",
        category: "SUV",
        price: 70000,
        quantity: 4,
      });
    });

    expect(
      await screen.findByText(
        "Vehicle added successfully"
      )
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/bmw x5/i)
    ).not.toHaveLength(0);
  });

  // =====================================
  // 7. Add Error
  // =====================================

  test("shows error when adding vehicle fails", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles: [],
    });

    createVehicle.mockRejectedValue({
      response: {
        data: {
          message: "Vehicle already exists",
        },
      },
    });

    render(<AdminDashboard />);

    await screen.findByText(
      /your inventory is empty/i
    );

    await user.click(
      screen.getByRole("button", {
        name: /submit vehicle/i,
      })
    );

    expect(
      await screen.findByText(
        "Vehicle already exists"
      )
    ).toBeInTheDocument();
  });

  // =====================================
  // 8. Edit Vehicle
  // =====================================

  test("selects vehicle for editing", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    const editButtons =
      screen.getAllByRole("button", {
        name: /edit/i,
      });

    await user.click(editButtons[0]);

    expect(
      await screen.findByText(
        "Editing: Toyota Fortuner"
      )
    ).toBeInTheDocument();
  });

  // =====================================
  // 9. Cancel Edit
  // =====================================

  test("cancels vehicle editing", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    const editButtons =
      screen.getAllByRole("button", {
        name: /edit/i,
      });

    await user.click(editButtons[0]);

    expect(
      screen.getByText(
        "Editing: Toyota Fortuner"
      )
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /cancel edit/i,
      })
    );

    expect(
      screen.getByText("Add Vehicle Form")
    ).toBeInTheDocument();
  });

  // =====================================
  // 10. Update Vehicle
  // =====================================

  test("updates selected vehicle", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    updateVehicle.mockResolvedValue({
      vehicle: {
        ...vehicles[0],
        price: 50000,
      },
    });

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    const editButtons =
      screen.getAllByRole("button", {
        name: /edit/i,
      });

    await user.click(editButtons[0]);

    await user.click(
      screen.getByRole("button", {
        name: /submit vehicle/i,
      })
    );

    await waitFor(() => {
      expect(updateVehicle).toHaveBeenCalledWith(
        "vehicle-1",
        {
          make: "Toyota",
          model: "Fortuner",
          category: "SUV",
          price: 45000,
          quantity: 5,
        }
      );
    });

    expect(
      await screen.findByText(
        "Vehicle updated successfully"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Add Vehicle Form")
    ).toBeInTheDocument();
  });

  // =====================================
  // 11. Delete - Cancel confirmation
  // =====================================

  test("does not delete vehicle when confirmation is cancelled", async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(() => false);

    getVehicles.mockResolvedValue({
      vehicles,
    });

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    const deleteButtons =
      screen.getAllByRole("button", {
        name: /delete vehicle/i,
      });

    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();

    expect(
      deleteVehicle
    ).not.toHaveBeenCalled();
  });

  // =====================================
  // 12. Delete Vehicle
  // =====================================

  test("deletes vehicle after confirmation", async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(() => true);

    getVehicles.mockResolvedValue({
      vehicles,
    });

    deleteVehicle.mockResolvedValue({});

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    const deleteButtons =
      screen.getAllByRole("button", {
        name: /delete vehicle/i,
      });

    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteVehicle).toHaveBeenCalledWith(
        "vehicle-1"
      );
    });

    expect(
      await screen.findByText(
        "Vehicle deleted successfully"
      )
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Toyota Fortuner"
        )
      ).not.toBeInTheDocument();
    });
  });

  // =====================================
  // 13. Delete Error
  // =====================================

  test("shows error when deleting vehicle fails", async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(() => true);

    getVehicles.mockResolvedValue({
      vehicles,
    });

    deleteVehicle.mockRejectedValue({
      response: {
        data: {
          message: "Delete failed",
        },
      },
    });

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    const deleteButtons =
      screen.getAllByRole("button", {
        name: /delete vehicle/i,
      });

    await user.click(deleteButtons[0]);

    expect(
      await screen.findByText("Delete failed")
    ).toBeInTheDocument();
  });

  // =====================================
  // 14. Invalid Restock
  // =====================================

  test("rejects invalid restock quantity", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    const restockButtons =
      screen.getAllByRole("button", {
        name: /restock/i,
      });

    // no quantity entered
    await user.click(restockButtons[0]);

    expect(
      await screen.findByText(
        "Restock quantity must be greater than 0"
      )
    ).toBeInTheDocument();

    expect(
      restockVehicle
    ).not.toHaveBeenCalled();
  });

  // =====================================
  // 15. Restock Vehicle
  // =====================================

  test("restocks a vehicle", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    restockVehicle.mockResolvedValue({
      vehicle: {
        ...vehicles[0],
        quantity: 8,
      },
    });

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    /*
      Component renders mobile + desktop versions,
      therefore there can be multiple quantity inputs.
    */

    const quantityInputs =
      screen.getAllByRole("spinbutton");

    await user.type(quantityInputs[0], "3");

    const restockButtons =
      screen.getAllByRole("button", {
        name: /restock/i,
      });

    await user.click(restockButtons[0]);

    await waitFor(() => {
      expect(restockVehicle).toHaveBeenCalledWith(
        "vehicle-1",
        3
      );
    });

    expect(
      await screen.findByText(
        "Vehicle restocked successfully"
      )
    ).toBeInTheDocument();
  });

  // =====================================
  // 16. Restock Error
  // =====================================

  test("shows error when restock fails", async () => {
    const user = userEvent.setup();

    getVehicles.mockResolvedValue({
      vehicles,
    });

    restockVehicle.mockRejectedValue({
      response: {
        data: {
          message: "Restock failed",
        },
      },
    });

    render(<AdminDashboard />);

    await screen.findAllByText(
      /toyota fortuner/i
    );

    const quantityInputs =
      screen.getAllByRole("spinbutton");

    await user.type(quantityInputs[0], "2");

    const restockButtons =
      screen.getAllByRole("button", {
        name: /restock/i,
      });

    await user.click(restockButtons[0]);

    expect(
      await screen.findByText(
        "Restock failed"
      )
    ).toBeInTheDocument();
  });

  // =====================================
  // 17. Layout
  // =====================================

  test("renders navbar, form and footer", async () => {
    getVehicles.mockResolvedValue({
      vehicles: [],
    });

    render(<AdminDashboard />);

    await screen.findByText(
      /your inventory is empty/i
    );

    expect(
      screen.getByTestId("navbar")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("vehicle-form")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("footer")
    ).toBeInTheDocument();
  });
});