import { z } from 'zod';

const createMedicineValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required.' }),
    company: z.string({ required_error: 'Company is required.' }),
    image: z.string({ required_error: 'Image is required.' }),
    // image: z.string().optional(),
    price: z
      .number({ required_error: 'Price is required.' })
      .positive('Price must be a positive number.'),
    type: z.string({ required_error: 'Type is required.' }),
    symptoms: z
      .array(z.string())
      .nonempty({ message: 'At least one symptom is required' }),
    description: z.string({ required_error: 'Description is required.' }),
    manufacturerDetails: z.string({
      required_error: 'Manufacturer details is required.',
    }),
    quantity: z
      .number({ required_error: 'Quantity is required.' })
      .int('Quantity must be an integer.')
      .nonnegative('Quantity must be a non-negative number.'),
    inStock: z.boolean().default(true),
    prescriptionRequired: z.boolean({
      required_error: 'Prescription requirement is required.',
    }),
    expiryDate: z
      .string({ required_error: 'Expiry date is required.' })
      .transform((val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid expiry date format.');
        }
        return date;
      }),
  }),
});

const updateMedicineValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    image: z.string().optional(),
    price: z.number().positive('Price must be a positive number.').optional(),
    type: z.string().optional(),
    symptoms: z.string().optional(),
    description: z.string().optional(),
    manufacturerDetails: z.string().optional(),
    quantity: z
      .number()
      .int('Quantity must be an integer.')
      .nonnegative('Quantity must be a non-negative number.')
      .optional(),
    inStock: z.boolean().optional(),
    prescriptionRequired: z.boolean().optional(),
    expiryDate: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        const date = new Date(val);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid expiry date format.');
        }
        return date;
      }),
  }),
});

export const MedicineValidationSchema = {
  createMedicineValidationSchema,
  updateMedicineValidationSchema,
};
