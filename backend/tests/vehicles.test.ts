import request from "supertest";
import jwt from "jsonwebtoken";
import "dotenv/config";
import mongoose from "mongoose";
import Vehicle from "../src/models/Vehicle";

import app from "../src/app";

beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI;

  if (!testDbUri) {
    throw new Error("MONGODB_TEST_URI is not defined");
  }

  await mongoose.connect(testDbUri);

  // create token...
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

let token: string;
let adminToken: string;

describe("POST /api/vehicles", () => {


  beforeAll(() => {
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

  it("should create a vehicle with valid data", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
      });

    expect(response.status).toBe(201);
  });

  it("should return 400 when make is missing", async () => {
    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
        });

    expect(response.status).toBe(400);
    });

    it("should return 400 when model is missing", async () => {
    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({
        make: "Toyota",
        category: "SUV",
        price: 45000,
        quantity: 5,
        });

    expect(response.status).toBe(400);
    });

    it("should return 400 when price is negative", async () => {
    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: -100,
        quantity: 5,
        });

    expect(response.status).toBe(400);
    });

    it("should return 400 when quantity is negative", async () => {
    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: -1,
        });

    expect(response.status).toBe(400);
    });

    it("should return 401 when authentication token is missing", async () => {
    const response = await request(app)
        .post("/api/vehicles")
        .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
        });

    expect(response.status).toBe(401);
    });

    it("should create a vehicle with valid data", async () => {
    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
        });

    expect(response.status).toBe(201);

    const vehicle = await Vehicle.findOne({
    make: "Toyota",
    model: "Fortuner",
    });

    expect(vehicle).not.toBeNull();
    expect(vehicle?.quantity).toBe(5);

    expect(response.body.vehicle.make).toBe("Toyota");
    expect(response.body.vehicle.model).toBe("Fortuner");
    expect(response.body.vehicle.category).toBe("SUV");
    expect(response.body.vehicle.price).toBe(45000);
    expect(response.body.vehicle.quantity).toBe(5);
    });
});

describe("GET /api/vehicles", () => {

  it("should return all vehicles", async () => {
    await Vehicle.create([
      {
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
      },
      {
        make: "Honda",
        model: "Civic",
        category: "Sedan",
        price: 30000,
        quantity: 3,
      },
    ]);

    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(2);
  });


  it("should return an empty array when no vehicles exist", async () => {
    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toEqual([]);
  });


  it("should return 401 when authentication token is missing", async () => {
    const response = await request(app)
      .get("/api/vehicles");

    expect(response.status).toBe(401);
  });

});

describe("PUT /api/vehicles/:id", () => {
  it("should update an existing vehicle", async () => {
    const vehicle = await Vehicle.create({
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    });

    const response = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 48000,
        quantity: 8,
      });

    expect(response.status).toBe(200);

    expect(response.body.vehicle.price).toBe(48000);
    expect(response.body.vehicle.quantity).toBe(8);
  });

  it("should return 404 when vehicle does not exist", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .put(`/api/vehicles/${nonExistingId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
        price: 50000,
        });

    expect(response.status).toBe(404);
    });


    it("should return 400 for an invalid vehicle id", async () => {
    const response = await request(app)
        .put("/api/vehicles/invalid-id")
        .set("Authorization", `Bearer ${token}`)
        .send({
        price: 50000,
        });

    expect(response.status).toBe(400);
    });


    it("should return 400 when price is negative", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
    });

    const response = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
        price: -100,
        });

    expect(response.status).toBe(400);
    });


    it("should return 400 when quantity is negative", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
    });

    const response = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
        quantity: -1,
        });

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
        .put(`/api/vehicles/${vehicle._id}`)
        .send({
        price: 50000,
        });

    expect(response.status).toBe(401);
    });
});


describe("DELETE /api/vehicles/:id", () => {
  it("should allow admin to delete a vehicle", async () => {
    const vehicle = await Vehicle.create({
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 45000,
      quantity: 5,
    });

    const response = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
  });
  it("should return 403 when normal user tries to delete a vehicle", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
    });

    const response = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
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
        .delete(`/api/vehicles/${vehicle._id}`);

    expect(response.status).toBe(401);
    });
    it("should return 404 when vehicle does not exist", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .delete(`/api/vehicles/${nonExistingId}`)
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    });
    it("should return 400 for invalid vehicle id", async () => {
    const response = await request(app)
        .delete("/api/vehicles/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    });

    it("should allow admin to delete a vehicle", async () => {
    const vehicle = await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 45000,
        quantity: 5,
    });

    const response = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
        "Vehicle deleted successfully"
    );

    const deletedVehicle = await Vehicle.findById(vehicle._id);

    expect(deletedVehicle).toBeNull();
    });
});