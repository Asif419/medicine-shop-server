export type TMedicine = {
    name: string;
    company: string;
    image: string;
    price: number;
    type: string;
    symptoms: string[];
    description: string;
    quantity: number;
    inStock: boolean;
    prescriptionRequired: boolean;
    expiryDate: Date;
    manufacturerDetails: string;
  };
  