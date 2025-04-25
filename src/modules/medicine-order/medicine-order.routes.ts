import { Router } from 'express';
import { orderMedicineController } from './medicine-order.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../users/user.const';

const OrderMedicineRouter = Router();

OrderMedicineRouter.post(
  '/',
  auth(userRole.customer),
  orderMedicineController.createMedicineOrder,
);

OrderMedicineRouter.get(
  '/verify',
  auth(userRole.customer),
  orderMedicineController.verifyMedicinePayment,
);

OrderMedicineRouter.post(
  '/add-to-cart',
  auth(userRole.customer, userRole.admin),
  orderMedicineController.addToCart,
);

OrderMedicineRouter.get(
  '/my-carts/:email',
  auth(userRole.customer, userRole.admin),
  orderMedicineController.getCartItem,
);

OrderMedicineRouter.get(
  '/order/my-orders',
  auth(userRole.customer, userRole.admin),
  orderMedicineController.getUserMedicineOrders,
);

OrderMedicineRouter.delete(
  '/order/:orderId',
  auth(userRole.admin),
  orderMedicineController.adminDeleteMedicineOrder,
);

OrderMedicineRouter.patch(
  '/update-order',
  auth(userRole.admin, userRole.customer),
  orderMedicineController.updateMedicineOrder,
);

OrderMedicineRouter.patch(
  '/update-order-quantity/:orderId',
  auth(userRole.customer),
  orderMedicineController.updateOrderQuantity,
);

OrderMedicineRouter.delete(
  '/:orderId',
  auth(userRole.customer),
  orderMedicineController.deleteMedicineOrder,
);

export default OrderMedicineRouter;
