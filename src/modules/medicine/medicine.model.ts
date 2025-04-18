import { model, Schema } from 'mongoose';
import { TMedicine } from './medicine.interface';

const MedicineSchema: Schema = new Schema<TMedicine>(
  {
    name: { type: String, required: [true, 'Name is required.'] },
    company: { type: String, required: [true, 'Company is required.'] },
    image: {
      type: String,
      // required: false,
      required: [true, 'Image is required.'],
      // match: [/^https?:\/\/.+/, 'Must be a valid image URL.'],
    },
    price: { type: Number, required: [true, 'Price is required.'] },
    type: { type: String, required: [true, 'Type is required.'] },
    symptoms: { type: [String], required: [true, 'Symptoms is required'] },
    description: { type: String, required: [true, 'Description is required.'] },
    manufacturerDetails: {
      type: String,
      required: [true, 'Manufacturer details is required.'],
    },
    quantity: { type: Number, required: [true, 'Quantity is required.'] },
    inStock: { type: Boolean, default: true },
    prescriptionRequired: {
      type: Boolean,
      required: [true, 'Prescription requirement is required.'],
    },
    expiryDate: { type: Date, required: [true, 'Expiry date is required.'] },
  },
  {
    timestamps: true,
  },
);

const Medicine = model<TMedicine>('Medicine', MedicineSchema);
export default Medicine;
