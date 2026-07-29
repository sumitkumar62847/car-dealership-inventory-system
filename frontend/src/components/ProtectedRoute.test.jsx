import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router";

import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects unauthenticated user to login", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard Page</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<div>Login Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Login Page")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Dashboard Page")
    ).not.toBeInTheDocument();
  });

  test("allows authenticated user to access protected route", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Dashboard Page</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Dashboard Page")
    ).toBeInTheDocument();
  });

  test("redirects non-admin user from admin route", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={<div>Home Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Home Page")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Admin Dashboard")
    ).not.toBeInTheDocument();
  });

  test("allows admin user to access admin route", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute adminOnly>
          <div>Admin Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Admin Dashboard")
    ).toBeInTheDocument();
  });

  test("allows admin user to access normal protected route", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Dashboard Page</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Dashboard Page")
    ).toBeInTheDocument();
  });
});