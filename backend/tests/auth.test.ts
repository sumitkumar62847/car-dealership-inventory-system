import request from "supertest";
import app from "../src/app";

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