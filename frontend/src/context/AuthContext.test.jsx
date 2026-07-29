import { render, screen, act } from "@testing-library/react";
import { jwtDecode } from "jwt-decode";

import {
  AuthProvider,
  useAuth,
} from "./AuthContext";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

// Small component used to read AuthContext values
const TestComponent = () => {
  const {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  return (
    <div>
      <p data-testid="token">
        {token || "no-token"}
      </p>

      <p data-testid="user">
        {user ? user.email : "no-user"}
      </p>

      <p data-testid="authenticated">
        {isAuthenticated ? "yes" : "no"}
      </p>

      <p data-testid="admin">
        {isAdmin ? "yes" : "no"}
      </p>

      <button
        onClick={() => login("new-token")}
      >
        Login
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("starts unauthenticated when no token exists", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByTestId("token")
    ).toHaveTextContent("no-token");

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("no-user");

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("no");

    expect(
      screen.getByTestId("admin")
    ).toHaveTextContent("no");
  });

  test("loads user from valid stored token", () => {
    localStorage.setItem(
      "token",
      "stored-token"
    );

    jwtDecode.mockReturnValue({
      userId: "123",
      email: "user@example.com",
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(jwtDecode).toHaveBeenCalledWith(
      "stored-token"
    );

    expect(
      screen.getByTestId("token")
    ).toHaveTextContent("stored-token");

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("user@example.com");

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("yes");

    expect(
      screen.getByTestId("admin")
    ).toHaveTextContent("no");
  });

  test("recognizes admin user from stored token", () => {
    localStorage.setItem(
      "token",
      "admin-token"
    );

    jwtDecode.mockReturnValue({
      userId: "456",
      email: "admin@example.com",
      role: "admin",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("yes");

    expect(
      screen.getByTestId("admin")
    ).toHaveTextContent("yes");
  });

  test("login stores token and authenticates user", () => {
    jwtDecode.mockReturnValue({
      userId: "123",
      email: "user@example.com",
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByRole("button", {
        name: /login/i,
      }).click();
    });

    expect(localStorage.getItem("token")).toBe(
      "new-token"
    );

    expect(
      screen.getByTestId("token")
    ).toHaveTextContent("new-token");

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("user@example.com");

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("yes");
  });

  test("logout removes token and user", () => {
    localStorage.setItem(
      "token",
      "stored-token"
    );

    jwtDecode.mockReturnValue({
      userId: "123",
      email: "user@example.com",
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("yes");

    act(() => {
      screen.getByRole("button", {
        name: /logout/i,
      }).click();
    });

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      screen.getByTestId("token")
    ).toHaveTextContent("no-token");

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("no-user");

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("no");
  });

  test("removes expired token", () => {
    localStorage.setItem(
      "token",
      "expired-token"
    );

    jwtDecode.mockReturnValue({
      userId: "123",
      email: "user@example.com",
      role: "user",

      // expired one hour ago
      exp: Math.floor(Date.now() / 1000) - 3600,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("no");

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("no-user");
  });

  test("removes invalid token when decoding fails", () => {
    localStorage.setItem(
      "token",
      "invalid-token"
    );

    jwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("no");

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("no-user");
  });

  test("does not login when new token is invalid", () => {
    jwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByRole("button", {
        name: /login/i,
      }).click();
    });

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      screen.getByTestId("authenticated")
    ).toHaveTextContent("no");

    expect(
      screen.getByTestId("user")
    ).toHaveTextContent("no-user");
  });

  test("throws error when useAuth is used outside AuthProvider", () => {
    const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

    const InvalidComponent = () => {
        useAuth();
        return <div>Invalid</div>;
    };

    expect(() => {
        render(<InvalidComponent />);
    }).toThrow(
        "useAuth must be used within an AuthProvider"
    );

    consoleSpy.mockRestore();
    });
});