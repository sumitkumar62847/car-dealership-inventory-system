import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import Register from "./Register";
import { registerUser } from "../services/api";

jest.mock("../services/api", () => ({
  registerUser: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("Register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderRegister = () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  };

  test("renders registration form", () => {
    renderRegister();

    expect(
      screen.getByRole("heading", {
        name: /get started/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/full name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^password$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /^create account$/i,
      })
    ).toBeInTheDocument();
  });

  test("shows validation error when fields are empty", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.click(
      screen.getByRole("button", {
        name: /^create account$/i,
      })
    );

    expect(
      screen.getByText(/please fill in all fields/i)
    ).toBeInTheDocument();

    expect(registerUser).not.toHaveBeenCalled();
  });

  test("allows user to enter registration details", async () => {
    const user = userEvent.setup();

    renderRegister();

    const nameInput =
      screen.getByLabelText(/full name/i);

    const emailInput =
      screen.getByLabelText(/email address/i);

    const passwordInput =
      screen.getByLabelText(/^password$/i);

    await user.type(nameInput, "Sumit Kumar");
    await user.type(emailInput, "sumit@example.com");
    await user.type(passwordInput, "Password123");

    expect(nameInput).toHaveValue("Sumit Kumar");

    expect(emailInput).toHaveValue(
      "sumit@example.com"
    );

    expect(passwordInput).toHaveValue(
      "Password123"
    );
  });

  test("toggles password visibility", async () => {
    const user = userEvent.setup();

    renderRegister();

    const passwordInput =
      screen.getByLabelText(/^password$/i);

    expect(passwordInput).toHaveAttribute(
      "type",
      "password"
    );

    await user.click(
      screen.getByRole("button", {
        name: /show password/i,
      })
    );

    expect(passwordInput).toHaveAttribute(
      "type",
      "text"
    );

    expect(
      screen.getByRole("button", {
        name: /hide password/i,
      })
    ).toBeInTheDocument();
  });

  test("registers user and redirects to login", async () => {
    const user = userEvent.setup();

    registerUser.mockResolvedValue({
      message: "User registered successfully",
    });

    renderRegister();

    await user.type(
      screen.getByLabelText(/full name/i),
      "Sumit Kumar"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "sumit@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^create account$/i,
      })
    );

    expect(registerUser).toHaveBeenCalledTimes(1);

    expect(registerUser).toHaveBeenCalledWith({
      name: "Sumit Kumar",
      email: "sumit@example.com",
      password: "Password123",
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/login"
    );
  });

  test("trims name and email before registration", async () => {
    const user = userEvent.setup();

    registerUser.mockResolvedValue({
      message: "User registered successfully",
    });

    renderRegister();

    await user.type(
      screen.getByLabelText(/full name/i),
      "  Sumit Kumar  "
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "  sumit@example.com  "
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^create account$/i,
      })
    );

    expect(registerUser).toHaveBeenCalledWith({
      name: "Sumit Kumar",
      email: "sumit@example.com",
      password: "Password123",
    });
  });

  test("shows API error when registration fails", async () => {
    const user = userEvent.setup();

    registerUser.mockRejectedValue({
      response: {
        data: {
          message: "Email already registered",
        },
      },
    });

    renderRegister();

    await user.type(
      screen.getByLabelText(/full name/i),
      "Sumit Kumar"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "sumit@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^create account$/i,
      })
    );

    expect(
      await screen.findByText(
        "Email already registered"
      )
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows fallback error when API has no message", async () => {
    const user = userEvent.setup();

    registerUser.mockRejectedValue(
      new Error("Network Error")
    );

    renderRegister();

    await user.type(
      screen.getByLabelText(/full name/i),
      "Sumit Kumar"
    );

    await user.type(
      screen.getByLabelText(/email address/i),
      "sumit@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^create account$/i,
      })
    );

    expect(
      await screen.findByText(
        /unable to create your account. please try again/i
      )
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("clears validation error when user starts typing", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.click(
      screen.getByRole("button", {
        name: /^create account$/i,
      })
    );

    expect(
      screen.getByText(/please fill in all fields/i)
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/full name/i),
      "Sumit"
    );

    expect(
      screen.queryByText(/please fill in all fields/i)
    ).not.toBeInTheDocument();
  });

  test("contains link to login page", () => {
    renderRegister();

    const loginLink = screen.getByRole("link", {
      name: /sign in/i,
    });

    expect(loginLink).toBeInTheDocument();

    expect(loginLink).toHaveAttribute(
      "href",
      "/login"
    );
  });
});