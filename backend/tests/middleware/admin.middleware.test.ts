import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { authMiddleware } from "../../src/middleware/auth.middleware";
import { adminMiddleware } from "../../src/middleware/admin.middleware";

const testApp = express();

testApp.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.status(200).json({
      message: "Admin access granted",
    });
  }
);

describe("Admin Middleware", () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  it("should return 403 when authenticated user is not admin", async () => {
    const token = jwt.sign(
      {
        userId: "123456",
        role: "user",
      },
      secret
    );

    const response = await request(testApp)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should allow authenticated admin", async () => {
    const token = jwt.sign(
      {
        userId: "654321",
        role: "admin",
      },
      secret
    );

    const response = await request(testApp)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Admin access granted",
    });
  });

  it("should return 401 when authentication token is missing", async () => {
    const response = await request(testApp)
      .get("/admin");

    expect(response.status).toBe(401);
  });
});