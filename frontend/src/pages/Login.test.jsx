import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import Login from "./Login";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Mock API
jest.mock("../services/api", () => ({
  loginUser: jest.fn(),
}));

// Mock AuthContext
jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock navigation
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("Login", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLogin,
    });
  });

  const renderLogin = () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  };

  test("renders login form", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", {
        name: /welcome back/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^password$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /^sign in$/i,
      })
    ).toBeInTheDocument();
  });

  test("shows validation error when fields are empty", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.click(
      screen.getByRole("button", {
        name: /^sign in$/i,
      })
    );

    expect(
      screen.getByText(
        /email and password are required/i
      )
    ).toBeInTheDocument();

    expect(loginUser).not.toHaveBeenCalled();
  });

  test("allows user to enter email and password", async () => {
    const user = userEvent.setup();

    renderLogin();

    const emailInput =
      screen.getByLabelText(/email address/i);

    const passwordInput =
      screen.getByLabelText(/^password$/i);

    await user.type(
      emailInput,
      "user@example.com"
    );

    await user.type(
      passwordInput,
      "Password123"
    );

    expect(emailInput).toHaveValue(
      "user@example.com"
    );

    expect(passwordInput).toHaveValue(
      "Password123"
    );
  });

  test("toggles password visibility", async () => {
    const user = userEvent.setup();

    renderLogin();

    const passwordInput =
      screen.getByLabelText(/^password$/i);

    const toggleButton =
      screen.getByRole("button", {
        name: /show password/i,
      });

    expect(passwordInput).toHaveAttribute(
      "type",
      "password"
    );

    await user.click(toggleButton);

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

  test("logs in normal user and redirects to home", async () => {
    const user = userEvent.setup();

    loginUser.mockResolvedValue({
      token: "valid-user-token",
    });

    mockLogin.mockReturnValue({
      userId: "123",
      role: "user",
    });

    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      "user@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^sign in$/i,
      })
    );

    expect(loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "Password123",
    });

    expect(mockLogin).toHaveBeenCalledWith(
      "valid-user-token"
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("logs in admin and redirects to admin dashboard", async () => {
    const user = userEvent.setup();

    loginUser.mockResolvedValue({
      token: "valid-admin-token",
    });

    mockLogin.mockReturnValue({
      userId: "456",
      role: "admin",
    });

    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      "admin@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "Admin123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^sign in$/i,
      })
    );

    expect(mockLogin).toHaveBeenCalledWith(
      "valid-admin-token"
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/admin"
    );
  });

  test("shows error when login credentials are incorrect", async () => {
    const user = userEvent.setup();

    loginUser.mockRejectedValue({
      response: {
        data: {
          message: "Invalid email or password",
        },
      },
    });

    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      "wrong@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "WrongPassword"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^sign in$/i,
      })
    );

    expect(
      await screen.findByText(
        "Invalid email or password"
      )
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows fallback error when API does not provide message", async () => {
    const user = userEvent.setup();

    loginUser.mockRejectedValue(
      new Error("Network error")
    );

    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      "user@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^sign in$/i,
      })
    );

    expect(
      await screen.findByText(
        /unable to sign in. please check your credentials/i
      )
    ).toBeInTheDocument();
  });

  test("shows error when authentication token is invalid", async () => {
    const user = userEvent.setup();

    loginUser.mockResolvedValue({
      token: "invalid-token",
    });

    mockLogin.mockReturnValue(null);

    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      "user@example.com"
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: /^sign in$/i,
      })
    );

    expect(
      await screen.findByText(
        /invalid authentication token/i
      )
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("contains link to register page", () => {
    renderLogin();

    const registerLink =
      screen.getByRole("link", {
        name: /create an account/i,
      });

    expect(registerLink).toBeInTheDocument();

    expect(registerLink).toHaveAttribute(
      "href",
      "/register"
    );
  });
});