import { TMedicine } from './medicine.interface';
import Medicine from './medicine.model';

const createMedicineProduct = async (data: TMedicine): Promise<TMedicine> => {
  const result = await Medicine.create(data);
  return result;
};

const getMedicines = async (
  searchTerm: string | undefined,
  sortBy: string | undefined,
  sortOrder: string | undefined,
) => {
  let query = {};

  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    query = {
      $or: [{ name: regex }, { symptoms: { $elemMatch: { $regex: regex } } }],
    };
  }

  const sortCriteria: Record<string, 1 | -1> = {};
  if (sortBy === 'price' || sortBy === 'quantity') {
    sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  sortCriteria['prescriptionRequired'] = -1;

  const result = await Medicine.find(query).sort(sortCriteria);
  return result;
};

const getSingleMedicine = async (id: string) => {
  const result = await Medicine.findById(id);
  return result;
};

const updateMedicine = async (id: string, data: TMedicine) => {
  const result = await Medicine.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const deleteMedicine = async (id: string) => {
  const result = await Medicine.findByIdAndDelete(id);
  return result;
};

export const MedicineService = {
  createMedicineProduct,
  getMedicines,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
