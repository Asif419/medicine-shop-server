import { Router } from 'express';
import { MedicineController } from './medicine.controller';
import auth from '../../middlewares/auth';
import { MedicineValidationSchema } from './medicine.validation';
import validateRequest from '../../middlewares/validateRequest';
import { userRole } from '../users/user.const';

const medicineRouter = Router();

medicineRouter.post(
  '/',
  auth(userRole.admin),
  validateRequest(MedicineValidationSchema.createMedicineValidationSchema),
  MedicineController.createMedicine,
);
medicineRouter.get('/:id', MedicineController.getSingleMedicine);
medicineRouter.patch(
  '/:productId',
  auth(userRole.admin),
  MedicineController.updateMedicine,
);
medicineRouter.delete(
  '/:productId',
  auth(userRole.admin),
  MedicineController.deleteMedicine,
);
medicineRouter.get('/', MedicineController.getMedicines);

export default medicineRouter;
