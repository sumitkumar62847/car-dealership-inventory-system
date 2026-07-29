import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SearchBar from "./SearchBar";
import { getVehicles } from "../services/api";

jest.mock("../services/api", () => ({
  getVehicles: jest.fn(),
}));

describe("SearchBar", () => {
  const mockVehicles = [
    {
      _id: "1",
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    },
    {
      _id: "2",
      make: "Toyota",
      model: "Camry",
      category: "Sedan",
      price: 35000,
      quantity: 4,
    },
    {
      _id: "3",
      make: "Honda",
      model: "Civic",
      category: "Sedan",
      price: 30000,
      quantity: 3,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    getVehicles.mockResolvedValue({
      vehicles: mockVehicles,
    });
  });

  // =====================================
  // 1. Loading State
  // =====================================

  test("renders loading state first", () => {
    // Keep request pending for this test.
    // This prevents async state updates after
    // the test has already finished.
    getVehicles.mockReturnValue(
      new Promise(() => {})
    );

    render(
      <SearchBar
        onSearch={jest.fn()}
        onReset={jest.fn()}
      />
    );

    expect(
      screen.getByText(/loading filters/i)
    ).toBeInTheDocument();
  });

  // =====================================
  // 2. Render Filters
  // =====================================

  test("renders search filters after vehicles are loaded", async () => {
    render(
      <SearchBar
        onSearch={jest.fn()}
        onReset={jest.fn()}
      />
    );

    expect(
      await screen.findByRole("button", {
        name: /^brand$/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /model.*select brand first/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /^category$/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", {
        name: /search vehicles/i,
      }).length
    ).toBeGreaterThan(0);
  });

  // =====================================
  // 3. Model Disabled Initially
  // =====================================

  test("disables model filter until a brand is selected", async () => {
    render(
      <SearchBar
        onSearch={jest.fn()}
        onReset={jest.fn()}
      />
    );

    await screen.findByRole("button", {
      name: /^brand$/i,
    });

    expect(
      screen.getByRole("button", {
        name: /model.*select brand first/i,
      })
    ).toBeDisabled();
  });

  // =====================================
  // 4. Brand Dropdown
  // =====================================

  test("shows available brands when brand dropdown is clicked", async () => {
    const user = userEvent.setup();

    render(
      <SearchBar
        onSearch={jest.fn()}
        onReset={jest.fn()}
      />
    );

    const brandButton =
      await screen.findByRole("button", {
        name: /^brand$/i,
      });

    await user.click(brandButton);

    expect(
      screen.getByText("Toyota")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Honda")
    ).toBeInTheDocument();
  });

  // =====================================
  // 5. Enable Model
  // =====================================

  test("enables model filter after selecting a brand", async () => {
    const user = userEvent.setup();

    render(
      <SearchBar
        onSearch={jest.fn()}
        onReset={jest.fn()}
      />
    );

    const brandButton =
      await screen.findByRole("button", {
        name: /^brand$/i,
      });

    await user.click(brandButton);

    await user.click(
      screen.getByText("Toyota")
    );

    expect(
      screen.getByRole("button", {
        name: /^model$/i,
      })
    ).toBeEnabled();
  });

  // =====================================
  // 6. Model Filtering
  // =====================================

  test("shows models belonging to selected brand", async () => {
    const user = userEvent.setup();

    render(
      <SearchBar
        onSearch={jest.fn()}
        onReset={jest.fn()}
      />
    );

    const brandButton =
      await screen.findByRole("button", {
        name: /^brand$/i,
      });

    await user.click(brandButton);

    await user.click(
      screen.getByText("Toyota")
    );

    const modelButton =
      screen.getByRole("button", {
        name: /^model$/i,
      });

    await user.click(modelButton);

    expect(
      screen.getByText("Fortuner")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Camry")
    ).toBeInTheDocument();

    // Honda Civic should not be available
    // when Toyota is selected.
    expect(
      screen.queryByText("Civic")
    ).not.toBeInTheDocument();
  });

  // =====================================
  // 7. Categories
  // =====================================

  test("shows available categories", async () => {
    const user = userEvent.setup();

    render(
      <SearchBar
        onSearch={jest.fn()}
        onReset={jest.fn()}
      />
    );

    const categoryButton =
      await screen.findByRole("button", {
        name: /^category$/i,
      });

    await user.click(categoryButton);

    expect(
      screen.getByText("SUV")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sedan")
    ).toBeInTheDocument();
  });

  // =====================================
  // 8. Search
  // =====================================

  test("calls onSearch when search form is submitted", async () => {
    const user = userEvent.setup();

    const onSearch = jest.fn();

    render(
      <SearchBar
        onSearch={onSearch}
        onReset={jest.fn()}
      />
    );

    // Select Toyota
    const brandButton =
      await screen.findByRole("button", {
        name: /^brand$/i,
      });

    await user.click(brandButton);

    await user.click(
      screen.getByText("Toyota")
    );

    // Select Fortuner
    const modelButton =
      screen.getByRole("button", {
        name: /^model$/i,
      });

    await user.click(modelButton);

    await user.click(
      screen.getByText("Fortuner")
    );

    // Select SUV
    const categoryButton =
      screen.getByRole("button", {
        name: /^category$/i,
      });

    await user.click(categoryButton);

    await user.click(
      screen.getByText("SUV")
    );

    // Desktop + mobile search buttons
    const searchButtons =
      screen.getAllByRole("button", {
        name: /search vehicles/i,
      });

    await user.click(searchButtons[0]);

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  // =====================================
  // 9. API Call
  // =====================================

  test("loads vehicles only once when component mounts", async () => {
    render(
      <SearchBar
        onSearch={jest.fn()}
        onReset={jest.fn()}
      />
    );

    await screen.findByRole("button", {
      name: /^brand$/i,
    });

    expect(getVehicles).toHaveBeenCalledTimes(1);
  });
});