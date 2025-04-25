/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../app/errors/AppError';
import { User } from '../users/user.model';
import { TAddToCartIntoDb, TOrderMedicine } from './medicine-order.interface';
import mongoose from 'mongoose';
import { orderUtils } from './order.utils';
import Medicine from '../medicine/medicine.model';
import OrderMedicine, { cartModel } from './medicine-order.model';

const addToCartIntoDb = async (payload: TAddToCartIntoDb) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (!isUserExist) {
    throw new AppError(404, 'User not found!');
  }

  const isProductExist = await Medicine.findById(payload.product);
  if (!isProductExist) {
    throw new AppError(404, 'Medicine not found!');
  }

  const createCart = await cartModel.create(payload);
  const result = await cartModel.findById(createCart._id).populate('product');

  return result;
};

const getCartItem = async (email: string) => {
  const products = await cartModel
    .find({ email: email.slice(6) })
    .populate('product');

  return products;
};

const createMedicineOrderService = async (
  data: TOrderMedicine,
  userId: string,
  client_ip: string,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const { product, quantity, prescriptionImage } = data;

    if (!data.customer) {
      data.customer = new mongoose.Types.ObjectId(user._id);
    }

    const medicine = await Medicine.findById(product).session(session);
    if (!medicine || medicine.quantity < quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Insufficient stock or product not found.',
      );
    }

    // Check prescription requirement
    if (medicine.prescriptionRequired && !prescriptionImage) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'This medicine requires a prescription. Please upload a prescription image.',
      );
    }

    data.totalPrice = medicine.price * quantity;
    medicine.quantity -= quantity;
    medicine.inStock = medicine.quantity > 0;
    await medicine.save({ session });

    const orderData = { ...data, customer: user._id };
    const result = await OrderMedicine.create([orderData], { session });
    await result[0].populate('customer', 'name email role');

    // Payment integration
    const shurjopayPayload = {
      amount: data.totalPrice,
      order_id: result[0]._id,
      currency: 'BDT',
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: 'N/A',
      customer_address: 'N/A',
      customer_city: 'N/A',
      client_ip,
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus) {
      await result[0].updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      });
    }

    await session.commitTransaction();
    session.endSession();

    return { order: result[0], checkout_url: payment.checkout_url };
  } catch (error) {
    //   console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Medicine order creation failed',
    );
  }
};

const verifyMedicinePayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);
  if (verifiedPayment.length) {
    await OrderMedicine.findOneAndUpdate(
      { 'transaction.id': order_id },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transaction_status': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status === 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status === 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status === 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }
  return verifiedPayment;
};

// const getAllOrdersByUser = async (userId: string) => {
//   const userOrders = await OrderMedicine.find({ customer: userId }).populate({
//     path: 'product',
//     select: 'name',
//   });
//   if (!userOrders || userOrders.length === 0) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'No orders found for this user');
//   }
//   return userOrders;
// };

const getAllOrders = async (userId: string, role: 'customer' | 'admin') => {
  let orders;

  if (role === 'admin') {
    // Admin gets all orders
    orders = await OrderMedicine.find().populate({
      path: 'product',
      select: 'name',
    });
  } else {
    // Customer gets only their orders
    orders = await OrderMedicine.find({ customer: userId }).populate({
      path: 'product',
      select: 'name',
    });
  }

  if (!orders || orders.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No orders found');
  }

  return orders;
};

// ===============Update quantity
const updateOrderQuantityService = async (
  orderId: string,
  userId: string,
  newQuantity: number,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderMedicine.findById(orderId).session(session);
    if (!order) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
    }

    if (order.customer.toString() !== userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Unauthorized to update this order',
      );
    }

    const medicine = await Medicine.findById(order.product).session(session);
    if (!medicine) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Medicine not found');
    }

    const quantityDifference = newQuantity - order.quantity;

    if (quantityDifference > 0 && medicine.quantity < quantityDifference) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Not enough stock available');
    }

    // Update medicine stock
    medicine.quantity -= quantityDifference;
    medicine.inStock = medicine.quantity > 0;
    await medicine.save({ session });

    // Update order quantity and total price
    order.quantity = newQuantity;
    order.totalPrice = medicine.price * newQuantity;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
// ===============Update quantity

const updateMedicineOrderIntoDb = async (payload: {
  id: string;
  status: string;
}) => {
  const isOrderExist = await OrderMedicine.findById(payload?.id);
  if (!isOrderExist) {
    throw new AppError(404, 'Order not found!');
  }

  const result = await OrderMedicine.findByIdAndUpdate(
    payload?.id,
    { status: payload?.status },
    { new: true },
  );

  return result;
};

const deleteOrderFromDB = async (id: string, userId: string) => {
  const order = await OrderMedicine.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  if (order.customer.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Unauthorized to delete this order',
    );
  }
  return await OrderMedicine.findByIdAndDelete(id);
};

const adminDeleteOrder = async (id: string) => {
  const order = await OrderMedicine.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  return await OrderMedicine.findByIdAndDelete(id);
};

export const orderMedicineService = {
  addToCartIntoDb,
  getCartItem,
  createMedicineOrderService,
  verifyMedicinePayment,
  getAllOrders,
  updateOrderQuantityService,
  updateMedicineOrderIntoDb,
  deleteOrderFromDB,
  adminDeleteOrder,
};