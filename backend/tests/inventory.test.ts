import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "dotenv/config";

import app from "../src/app";
import Vehicle from "../src/models/Vehicle";

let token: string;
let adminToken: string;

beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI;

  if (!testDbUri) {
    throw new Error("MONGODB_TEST_URI is not defined");
  }

  await mongoose.connect(testDbUri);

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  token = jwt.sign(
    {
      userId: "123456",
      role: "user",
    },
    secret
  );

  adminToken = jwt.sign(
    {
        userId: "admin123",
        role: "admin",
    },
    secret
    );
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/vehicles/:id/purchase", () => {
  it("should purchase a vehicle and decrease quantity by 1", async () => {
    const vehicle = await Vehicle.create({
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.vehicle.quantity).toBe(4);

    const updatedVehicle = await Vehicle.findById(vehicle._id);

    expect(updatedVehicle?.quantity).toBe(4);
  });

  it("should return 400 when vehicle is out of stock", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 0,
    });

    const response = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Vehicle out of stock");

    const unchangedVehicle = await Vehicle.findById(vehicle._id);

    expect(unchangedVehicle?.quantity).toBe(0);
    });

    it("should return 404 when vehicle does not exist", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .post(`/api/vehicles/${nonExistingId}/purchase`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    });

    it("should return 400 for invalid vehicle id", async () => {
    const response = await request(app)
        .post("/api/vehicles/invalid-id/purchase")
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    });

    it("should return 401 when authentication token is missing", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
    });

    const response = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`);

    expect(response.status).toBe(401);
    });
  
});

describe("POST /api/vehicles/:id/restock", () => {
  it("should allow admin to restock a vehicle", async () => {
    const vehicle = await Vehicle.create({
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 3,
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantity: 5,
      });

    expect(response.status).toBe(200);

    expect(response.body.vehicle.quantity).toBe(8);

    const updatedVehicle = await Vehicle.findById(
    vehicle._id
    );

    expect(updatedVehicle?.quantity).toBe(8);
  });

  it("should return 403 when normal user tries to restock", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 3,
    });

    const response = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set("Authorization", `Bearer ${token}`)
        .send({
        quantity: 5,
        });

    expect(response.status).toBe(403);
    });
    it("should return 401 when authentication token is missing", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 3,
    });

    const response = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .send({
        quantity: 5,
        });

    expect(response.status).toBe(401);
    });
    it("should return 404 when vehicle does not exist", async () => {
    const nonExistingId =
        new mongoose.Types.ObjectId();

    const response = await request(app)
        .post(
        `/api/vehicles/${nonExistingId}/restock`
        )
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
        quantity: 5,
        });

    expect(response.status).toBe(404);
    });
    it("should return 400 for invalid vehicle id", async () => {
    const response = await request(app)
        .post("/api/vehicles/invalid-id/restock")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
        quantity: 5,
        });

    expect(response.status).toBe(400);
    });
    it("should return 400 when restock quantity is negative", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 3,
    });

    const response = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
        quantity: -5,
        });

    expect(response.status).toBe(400);
    });
    it("should return 400 when restock quantity is zero", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 3,
    });

    const response = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
        quantity: 0,
        });

    expect(response.status).toBe(400);
    });
    it("should return 400 when quantity is missing", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 3,
    });

    const response = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

    expect(response.status).toBe(400);
    });
    
});