import Vehicle from "../models/Vehicle";

interface CreateVehicleData {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export const createVehicle = async (
  vehicleData: CreateVehicleData
) => {
  return await Vehicle.create(vehicleData);
};

export const getAllVehicles = async () => {
  return await Vehicle.find();
};

export const updateVehicleById = async (
  id: string,
  updateData: Partial<{
    make: string;
    model: string;
    category: string;
    price: number;
    quantity: number;
  }>
) => {
  return await Vehicle.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteVehicleById = async (id: string) => {
  return await Vehicle.findByIdAndDelete(id);
};

interface VehicleSearchFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const searchVehicles = async (
  filters: VehicleSearchFilters
) => {
  const query: Record<string, unknown> = {};

  if (filters.make) {
    query.make = {
      $regex: filters.make,
      $options: "i",
    };
  }

  if (filters.model) {
    query.model = {
      $regex: filters.model,
      $options: "i",
    };
  }

  if (filters.category) {
    query.category = {
      $regex: filters.category,
      $options: "i",
    };
  }

  if (
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined
  ) {
    const priceQuery: {
      $gte?: number;
      $lte?: number;
    } = {};

    if (filters.minPrice !== undefined) {
      priceQuery.$gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      priceQuery.$lte = filters.maxPrice;
    }

    query.price = priceQuery;
  }

  return await Vehicle.find(query);
};

export const purchaseVehicleById = async (
  id: string
) => {
  return await Vehicle.findOneAndUpdate(
    {
      _id: id,
      quantity: { $gt: 0 },
    },
    {
      $inc: {
        quantity: -1,
      },
    },
    {
      new: true,
    }
  );
};

export const getVehicleById = async (
  id: string
) => {
  return await Vehicle.findById(id);
};