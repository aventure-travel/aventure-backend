import { Document, model, Schema } from "mongoose";
import { DatabaseReview } from "./MongooseHotel";
import { addressSchema, DatabaseAddress } from "./DatabaseAddress";
import { AccessibilityAmenity } from "@model";
import { ACCESSIBILITY_AMENITIES } from "@constants";

const CUISINE = [
  "bavarian",
  "german",
  "italian",
  "greek",
  "indian",
  "chinese",
  "thai",
  "french",
  "spanish",
  "turkish",
  "vietnamese",
  "japanese",
  "american",
  "mexican",
  "african",
  "other",
] as const;

type CUISINE = (typeof CUISINE)[number];

const reviewSchema = new Schema<DatabaseReview>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    rating: { type: Number, required: true },
    text: { type: "string", required: true },
  },
  { timestamps: true }
);

export interface DatabaseRestaurant extends Document {
  name: string;
  address: DatabaseAddress;
  reviews: DatabaseReview[];
  rating: number;
  highlights: string;
  isVerified: boolean;
  images: string[];
  phoneNumber: string;
  cuisines: CUISINE[];
  accessibilityAmenities: AccessibilityAmenity[];
  affiliateLink: string;
}

const restaurantSchema = new Schema<DatabaseRestaurant>(
  {
    name: { type: String, required: true },
    address: { type: addressSchema, required: true },
    reviews: { type: [reviewSchema], required: true },
    rating: { type: Number, required: true },
    highlights: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    images: { type: [String], required: true },
    phoneNumber: { type: String, required: true },
    cuisines: { type: [String], enum: CUISINE, required: true },
    accessibilityAmenities: { type: [String], enum: ACCESSIBILITY_AMENITIES, required: true },
    affiliateLink: { type: String, required: true },
  },
  { timestamps: true }
);

export const MongooseRestaurant = model<DatabaseRestaurant>("restaurant", restaurantSchema);
