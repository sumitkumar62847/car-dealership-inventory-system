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