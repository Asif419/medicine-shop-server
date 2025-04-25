
import { Types } from 'mongoose';

export type TOrderMedicine = {
  email?: string;
  customer: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status?: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled';
  prescriptionImage?: string;
  transaction?: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};

export type TAddToCartIntoDb = {
  product: Types.ObjectId;
  quantity: number;
  email : string ;
};
