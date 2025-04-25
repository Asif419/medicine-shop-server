/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { orderMedicineService } from './medicine-order.service';
import AppError from '../../app/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const result = await orderMedicineService.addToCartIntoDb(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Medicine added to cart successfully!',
    data: result,
  });
});

const getCartItem = catchAsync(async (req: Request, res: Response) => {
  const result = await orderMedicineService.getCartItem(req.params?.email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Medicine cart items retrieved successfully',
    data: result,
  });
});

const createMedicineOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User Not Authenticated');
  }

  const { product, quantity } = req.body;

  if (!product || !quantity) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Product and quantity are required.',
    );
  }

  const medicineOrderData = {
    ...req.body,
    customer: userId,
  };

  const client_ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const result = await orderMedicineService.createMedicineOrderService(
    medicineOrderData,
    userId,
    client_ip,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Medicine order created successfully',
    data: result,
  });
});

const verifyMedicinePayment = catchAsync(async (req, res) => {
  const order = await orderMedicineService.verifyMedicinePayment(
    req.query.order_id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order verified successfully',
    data: order,
  });
});

// const getUserMedicineOrders = catchAsync(
//   async (req: Request, res: Response) => {
//     const userId = req.user?._id;
//     const result = await orderMedicineService.getAllOrdersByUser(userId);

//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: 'Orders retrieved successfully',
//       data: result,
//     });
//   },
// );

const getUserMedicineOrders = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const role = req.user?.role;

    const result = await orderMedicineService.getAllOrders(userId, role);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  },
);

// ===========update quantity==========
const updateOrderQuantity = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { orderId } = req.params;
  const { newQuantity } = req.body;

  if (!newQuantity || newQuantity <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid quantity provided');
  }

  const updatedOrder = await orderMedicineService.updateOrderQuantityService(
    orderId,
    userId,
    newQuantity,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order quantity updated successfully',
    data: updatedOrder,
  });
});
// ===========update quantity==========

const deleteMedicineOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?._id;

  await orderMedicineService.deleteOrderFromDB(orderId, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
  });
});

const updateMedicineOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderMedicineService.updateMedicineOrderIntoDb(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Medicine order status updated successfully!',
    data: result,
  });
});

const adminDeleteMedicineOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderMedicineService.adminDeleteOrder(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const orderMedicineController = {
  addToCart,
  getCartItem,
  createMedicineOrder,
  verifyMedicinePayment,
  getUserMedicineOrders,
  updateOrderQuantity,
  deleteMedicineOrder,
  updateMedicineOrder,
  adminDeleteMedicineOrder,
};