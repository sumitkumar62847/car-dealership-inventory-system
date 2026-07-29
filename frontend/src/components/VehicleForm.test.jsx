import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import VehicleForm from "./VehicleForm";

describe("VehicleForm", () => {
  let mockSubmit;
  let mockCancel;

  beforeEach(() => {
    mockSubmit = jest.fn();
    mockCancel = jest.fn();
  });

  const renderForm = (props = {}) => {
    return render(
      <VehicleForm
        vehicle={null}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        loading={false}
        {...props}
      />
    );
  };

  const openAddForm = async () => {
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: /add vehicle/i,
      })
    );

    return user;
  };

  test("shows Add Vehicle button initially", () => {
    renderForm();

    expect(
      screen.getByRole("button", {
        name: /add vehicle/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/add a new vehicle/i)
    ).toBeInTheDocument();
  });

  test("opens add vehicle form", async () => {
    renderForm();

    await openAddForm();

    expect(
      screen.getByRole("heading", {
        name: /add new vehicle/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^make$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^model$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^category$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^price$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^quantity$/i)
    ).toBeInTheDocument();
  });

  test("shows error when required fields are empty", async () => {
    renderForm();

    const user = await openAddForm();

    await user.click(
      screen.getByRole("button", {
        name: /^add vehicle$/i,
      })
    );

    expect(
      screen.getByText(
        /please fill in all fields/i
      )
    ).toBeInTheDocument();

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test("submits valid vehicle data", async () => {
    renderForm();

    const user = await openAddForm();

    await user.type(
      screen.getByLabelText(/^make$/i),
      "Toyota"
    );

    await user.type(
      screen.getByLabelText(/^model$/i),
      "Fortuner"
    );

    await user.type(
      screen.getByLabelText(/^category$/i),
      "SUV"
    );

    await user.type(
      screen.getByLabelText(/^price$/i),
      "45000"
    );

    await user.type(
      screen.getByLabelText(/^quantity$/i),
      "5"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^add vehicle$/i,
      })
    );

    expect(mockSubmit).toHaveBeenCalledTimes(1);

    expect(mockSubmit).toHaveBeenCalledWith({
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    });
  });

  test("trims text values before submitting", async () => {
    renderForm();

    const user = await openAddForm();

    await user.type(
      screen.getByLabelText(/^make$/i),
      "  Toyota  "
    );

    await user.type(
      screen.getByLabelText(/^model$/i),
      "  Fortuner  "
    );

    await user.type(
      screen.getByLabelText(/^category$/i),
      "  SUV  "
    );

    await user.type(
      screen.getByLabelText(/^price$/i),
      "45000"
    );

    await user.type(
      screen.getByLabelText(/^quantity$/i),
      "5"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^add vehicle$/i,
      })
    );

    expect(mockSubmit).toHaveBeenCalledWith({
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    });
  });

  test("shows error when price is negative", async () => {
    renderForm();

    const user = await openAddForm();

    await user.type(
      screen.getByLabelText(/^make$/i),
      "Toyota"
    );

    await user.type(
      screen.getByLabelText(/^model$/i),
      "Fortuner"
    );

    await user.type(
      screen.getByLabelText(/^category$/i),
      "SUV"
    );

    /*
      type=number with min=0 can behave differently
      with userEvent/jsdom, so set the value directly.
    */
    fireEvent.change(
      screen.getByLabelText(/^price$/i),
      {
        target: {
          value: "-100",
        },
      }
    );

    await user.type(
      screen.getByLabelText(/^quantity$/i),
      "5"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^add vehicle$/i,
      })
    );

    expect(
      screen.getByText(
        /price cannot be negative/i
      )
    ).toBeInTheDocument();

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test("shows error when quantity is negative", async () => {
    renderForm();

    const user = await openAddForm();

    await user.type(
      screen.getByLabelText(/^make$/i),
      "Toyota"
    );

    await user.type(
      screen.getByLabelText(/^model$/i),
      "Fortuner"
    );

    await user.type(
      screen.getByLabelText(/^category$/i),
      "SUV"
    );

    await user.type(
      screen.getByLabelText(/^price$/i),
      "45000"
    );

    fireEvent.change(
      screen.getByLabelText(/^quantity$/i),
      {
        target: {
          value: "-1",
        },
      }
    );

    await user.click(
      screen.getByRole("button", {
        name: /^add vehicle$/i,
      })
    );

    expect(
      screen.getByText(
        /quantity cannot be negative/i
      )
    ).toBeInTheDocument();

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test("clears validation error when user starts typing", async () => {
    renderForm();

    const user = await openAddForm();

    await user.click(
      screen.getByRole("button", {
        name: /^add vehicle$/i,
      })
    );

    expect(
      screen.getByText(
        /please fill in all fields/i
      )
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/^make$/i),
      "Toyota"
    );

    expect(
      screen.queryByText(
        /please fill in all fields/i
      )
    ).not.toBeInTheDocument();
  });

  test("cancel closes add form and resets fields", async () => {
    renderForm();

    const user = await openAddForm();

    await user.type(
      screen.getByLabelText(/^make$/i),
      "Toyota"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^cancel$/i,
      })
    );

    expect(
      screen.queryByLabelText(/^make$/i)
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /add vehicle/i,
      })
    ).toBeInTheDocument();

    /*
      In add mode your component intentionally does
      NOT call onCancel().
    */
    expect(mockCancel).not.toHaveBeenCalled();
  });

  test("automatically opens form when editing vehicle", () => {
    const vehicle = {
      _id: "vehicle-1",
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    };

    renderForm({
      vehicle,
    });

    expect(
      screen.getByRole("heading", {
        name: /update vehicle/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^make$/i)
    ).toHaveValue("Toyota");

    expect(
      screen.getByLabelText(/^model$/i)
    ).toHaveValue("Fortuner");

    expect(
      screen.getByLabelText(/^category$/i)
    ).toHaveValue("SUV");

    expect(
      screen.getByLabelText(/^price$/i)
    ).toHaveValue(45000);

    expect(
      screen.getByLabelText(/^quantity$/i)
    ).toHaveValue(5);
  });

  test("submits updated vehicle data in edit mode", async () => {
    const user = userEvent.setup();

    const vehicle = {
      _id: "vehicle-1",
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    };

    renderForm({
      vehicle,
    });

    const priceInput =
      screen.getByLabelText(/^price$/i);

    await user.clear(priceInput);
    await user.type(priceInput, "48000");

    const quantityInput =
      screen.getByLabelText(/^quantity$/i);

    await user.clear(quantityInput);
    await user.type(quantityInput, "8");

    await user.click(
      screen.getByRole("button", {
        name: /save changes/i,
      })
    );

    expect(mockSubmit).toHaveBeenCalledWith({
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 48000,
      quantity: 8,
    });
  });

  test("calls onCancel when cancelling edit mode", async () => {
    const user = userEvent.setup();

    const vehicle = {
      _id: "vehicle-1",
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    };

    renderForm({
      vehicle,
    });

    await user.click(
      screen.getByRole("button", {
        name: /^cancel$/i,
      })
    );

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  test("close button calls onCancel in edit mode", async () => {
    const user = userEvent.setup();

    const vehicle = {
      _id: "vehicle-1",
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    };

    renderForm({
      vehicle,
    });

    await user.click(
      screen.getByRole("button", {
        name: /close form/i,
      })
    );

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  test("disables form controls while loading", () => {
    const vehicle = {
      _id: "vehicle-1",
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    };

    renderForm({
      vehicle,
      loading: true,
    });

    expect(
      screen.getByLabelText(/^make$/i)
    ).toBeDisabled();

    expect(
      screen.getByLabelText(/^model$/i)
    ).toBeDisabled();

    expect(
      screen.getByLabelText(/^category$/i)
    ).toBeDisabled();

    expect(
      screen.getByLabelText(/^price$/i)
    ).toBeDisabled();

    expect(
      screen.getByLabelText(/^quantity$/i)
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: /saving/i,
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: /^cancel$/i,
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: /close form/i,
      })
    ).toBeDisabled();
  });
});