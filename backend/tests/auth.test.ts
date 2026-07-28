import request from "supertest";
import app from "../src/app";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import mongoose from "mongoose";
import "dotenv/config";

import User from "../src/models/User";

beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI;

  if (!testDbUri) {
    throw new Error("MONGODB_TEST_URI is not defined");
  }

  await mongoose.connect(testDbUri);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/auth/register", () => {

  it("should register a user with valid data", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sumit Kumar",
        email: "sumit@example.com",
        password: "Password123",
      });

    expect(response.status).toBe(201);
  });

  it("should store the password as a hash", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sumit Kumar",
        email: "sumit@example.com",
        password: "Password123",
      });

    // Find the created user directly from test database
    const user = await User.findOne({
      email: "sumit@example.com",
    });

    expect(user).not.toBeNull();

    // Password should NOT be stored as plain text
    expect(user!.password).not.toBe("Password123");

    // Original password should match the stored bcrypt hash
    const matches = await bcrypt.compare(
      "Password123",
      user!.password
    );

    expect(matches).toBe(true);
  });



  it("should return 400 when name is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "sumit@example.com",
        password: "Password123",
      });

    expect(response.status).toBe(400);
  });


  it("should return 400 when email is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sumit Kumar",
        password: "Password123",
      });

    expect(response.status).toBe(400);
  });


  it("should return 400 when password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sumit Kumar",
        email: "sumit@example.com",
      });

    expect(response.status).toBe(400);
  });

});


describe("POST /api/auth/login", () => {
  const userData = {
    name: "Sumit Kumar",
    email: "sumit@example.com",
    password: "Password123",
  };

  beforeEach(async () => {
    await request(app)
      .post("/api/auth/register")
      .send(userData);
  });

  it("should login user with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(response.status).toBe(200);
  });

  it("should return a token after successful login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe("string");
  });

  it("should return 401 for incorrect password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: "WrongPassword",
      });

    expect(response.status).toBe(401);
  });

  it("should return 401 for nonexistent email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "unknown@example.com",
        password: "Password123",
      });

    expect(response.status).toBe(401);
  });

  it("should return 400 when email is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        password: "Password123",
      });

    expect(response.status).toBe(400);
  });

  it("should return 400 when password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
      });

    expect(response.status).toBe(400);
  });

  it("should not return password after successful login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(response.body.password).toBeUndefined();
    expect(response.body.user?.password).toBeUndefined();
  });

  it("should return a valid JWT containing userId and role", async () => {
    const response = await request(app)
        .post("/api/auth/login")
        .send({
        email: userData.email,
        password: userData.password,
        });

    expect(response.status).toBe(200);

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(
        response.body.token,
        secret
    ) as jwt.JwtPayload;

    expect(decoded.userId).toBeDefined();
    expect(decoded.role).toBe("user");
    });
});