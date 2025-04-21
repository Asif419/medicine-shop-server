import { Request, Response } from 'express';
import { MedicineService } from './medicine.service';

const createMedicine = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await MedicineService.createMedicineProduct(data);
    res.json({
      message: 'Medicine created successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

const getMedicines = async (req: Request, res: Response) => {
  try {
    const { searchTerm, sortBy, sortOrder } = req.query;
    const result = await MedicineService.getMedicines(
      searchTerm as string,
      sortBy as string,
      sortOrder as string,
    );

    res.send({
      message: 'Medicines retrieved successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went wrong',
      error,
    });
  }
};

const getSingleMedicine = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await MedicineService.getSingleMedicine(id);
    res.send({
      message: 'Medicine retrieved successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went wrong',
      error,
    });
  }
};

const updateMedicine = async (req: Request, res: Response) => {
  try {
    const medicineId = req.params.productId;
    const body = req.body;
    const result = await MedicineService.updateMedicine(medicineId, body);
    res.send({
      message: 'Medicine updated successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went wrong',
      error,
    });
  }
};

const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const medicineId = req.params.productId;
    await MedicineService.deleteMedicine(medicineId);

    res.send({
      message: 'Medicine deleted successfully',
      status: true,
      data: {},
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went wrong',
      error,
    });
  }
};

export const MedicineController = {
  createMedicine,
  getMedicines,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
