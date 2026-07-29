import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VehicleCard from "./VehicleCard";

describe("VehicleCard", () => {
  const vehicle = {
    _id: "123",
    make: "Toyota",
    model: "Fortuner",
    category: "SUV",
    price: 45000,
    quantity: 5,
  };

  test("displays vehicle information", () => {
    render(
      <VehicleCard
        vehicle={vehicle}
        onPurchase={() => {}}
        purchasing={false}
      />
    );

    expect(
      screen.getByText("Toyota Fortuner")
    ).toBeInTheDocument();

    expect(
      screen.getByText("SUV")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₹45,000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("5 units")
    ).toBeInTheDocument();
  });
});