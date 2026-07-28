import { Request, Response } from "express";
import { createVehicle,getAllVehicles, updateVehicleById,deleteVehicleById,searchVehicles,purchaseVehicleById, getVehicleById,} from "../services/vehicle.service";
import mongoose from "mongoose";

export const addVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      make,
      model,
      category,
      price,
      quantity,
    } = req.body;

    if (
      !make ||
      !model ||
      !category ||
      price === undefined ||
      quantity === undefined
    ) {
      res.status(400).json({
        message: "All vehicle fields are required",
      });
      return;
    }

    if (price < 0 || quantity < 0) {
      res.status(400).json({
        message: "Price and quantity cannot be negative",
      });
      return;
    }

    const vehicle = await createVehicle({
      make,
      model,
      category,
      price,
      quantity,
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getVehicles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicles = await getAllVehicles();

    res.status(200).json({
      vehicles,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { make, model, category, price, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: "Invalid vehicle ID",
      });
      return;
    }

    if (price !== undefined && price < 0) {
      res.status(400).json({
        message: "Price cannot be negative",
      });
      return;
    }

    if (quantity !== undefined && quantity < 0) {
      res.status(400).json({
        message: "Quantity cannot be negative",
      });
      return;
    }

    const vehicle = await updateVehicleById(id, req.body);

    if (!vehicle) {
      res.status(404).json({
        message: "Vehicle not found",
      });
      return;
    }

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: "Invalid vehicle ID",
      });
      return;
    }

    const vehicle = await deleteVehicleById(id);

    if (!vehicle) {
      res.status(404).json({
        message: "Vehicle not found",
      });
      return;
    }

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const searchVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      make,
      model,
      category,
      minPrice,
      maxPrice,
    } = req.query;

    const min =
      minPrice !== undefined
        ? Number(minPrice)
        : undefined;

    const max =
      maxPrice !== undefined
        ? Number(maxPrice)
        : undefined;

    if (
      (min !== undefined && Number.isNaN(min)) ||
      (max !== undefined && Number.isNaN(max))
    ) {
      res.status(400).json({
        message: "Price must be a valid number",
      });
      return;
    }

    if (
      min !== undefined &&
      max !== undefined &&
      min > max
    ) {
      res.status(400).json({
        message: "Minimum price cannot exceed maximum price",
      });
      return;
    }

    const vehicles = await searchVehicles({
      make: typeof make === "string" ? make : undefined,
      model: typeof model === "string" ? model : undefined,
      category:
        typeof category === "string"
          ? category
          : undefined,
      minPrice: min,
      maxPrice: max,
    });

    res.status(200).json({
      vehicles,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const purchaseVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: "Invalid vehicle ID",
      });
      return;
    }

    const vehicle = await getVehicleById(id);

    if (!vehicle) {
      res.status(404).json({
        message: "Vehicle not found",
      });
      return;
    }

    if (vehicle.quantity <= 0) {
      res.status(400).json({
        message: "Vehicle out of stock",
      });
      return;
    }

    const updatedVehicle = await purchaseVehicleById(id);

    if (!updatedVehicle) {
      res.status(400).json({
        message: "Vehicle out of stock",
      });
      return;
    }

    res.status(200).json({
      message: "Vehicle purchased successfully",
      vehicle: updatedVehicle,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};