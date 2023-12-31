import { Schema } from "mongoose";

export interface DatabaseAddress {
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
}

export const addressSchema = new Schema<DatabaseAddress>(
  {
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    zipCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);
