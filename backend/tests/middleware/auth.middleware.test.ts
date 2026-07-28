import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { authMiddleware } from "../../src/middleware/auth.middleware";

const testApp = express();

testApp.get(
  "/protected",
  authMiddleware,
  (req, res) => {
    res.status(200).json({
      message: "Protected route accessed",
    });
  }
);

describe("JWT Authentication Middleware", () => {
  it("should return 401 when Authorization header is missing", async () => {
    const response = await request(testApp)
      .get("/protected");

    expect(response.status).toBe(401);
  });

  it("should return 401 for an invalid token", async () => {
    const response = await request(testApp)
      .get("/protected")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("should return 401 for malformed Authorization header", async () => {
    const response = await request(testApp)
      .get("/protected")
      .set("Authorization", "invalid-token");

    expect(response.status).toBe(401);
  });

  it("should allow request with a valid JWT", async () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        userId: "123456",
        role: "user",
      },
      secret
    );

    const response = await request(testApp)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Protected route accessed",
    });
  });
  it("should return 401 for an expired token", async () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
        {
        userId: "123456",
        role: "user",
        },
        secret,
        {
        expiresIn: -1,
        }
    );

    const response = await request(testApp)
        .get("/protected")
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    });
});