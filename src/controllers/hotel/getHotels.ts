import { databaseService } from "@services";
import { toDTOHotel } from "./toDTOHotel";
import { controller } from "../common/controller";
import { DTOHotel } from "../model/DTOHotel";
import { z } from "zod";
import { ACCESSIBILITY_AMENITIES, HOTEL_AMENITIES } from "@constants";

const SORT = ["name", "rating", "stars"] as const;

const PAGE_SIZE = 20;

type Filters = {
  isVerified?: boolean;
  stars?: number[];
  rating?: number[];
  amenities?: DTOHotel["amenities"];
  accessibilityAmenities?: DTOHotel["accessibilityAmenities"];
};

type Query = {
  searchTerm?: string;
  page: number;
  sort: (typeof SORT)[number];
  filters?: Filters;
};

type Response = {
  resultsCount: number;
  pageSize: number;
  data: DTOHotel[];
};

export const getHotels = controller<undefined, undefined, undefined, Response, Query>(
  async ({ query: { searchTerm, page, sort, filters }, res }) => {
    const hotels = await databaseService.findHotelsBySearchTerm(searchTerm ?? "");

    let mappedHotels = await Promise.all(hotels.map(toDTOHotel));

    if (sort === "name") {
      mappedHotels?.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "rating") {
      mappedHotels?.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sort === "stars") {
      mappedHotels?.sort((a, b) => b.stars - a.stars);
    }

    const { isVerified, stars, rating, amenities, accessibilityAmenities } = filters ?? {};

    if (isVerified) {
      mappedHotels = mappedHotels?.filter((hotel) => hotel.isVerified);
    }
    if (stars && stars.length > 0) {
      mappedHotels = mappedHotels?.filter((hotel) => stars.includes(hotel.stars));
    }
    if (rating && rating.length > 0) {
      mappedHotels = mappedHotels?.filter((hotel) => rating.includes(hotel.rating ?? 0));
    }
    if (amenities && amenities.length > 0) {
      mappedHotels = mappedHotels?.filter((hotel) =>
        hotel.amenities.some((amenity) => amenities.includes(amenity))
      );
    }
    if (accessibilityAmenities && accessibilityAmenities.length > 0) {
      mappedHotels = mappedHotels?.filter((hotel) =>
        hotel.accessibilityAmenities.some((amenity) => accessibilityAmenities.includes(amenity))
      );
    }

    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = page * PAGE_SIZE;

    const paginatedHotels = mappedHotels.slice(startIndex, endIndex);

    res.status(200).json({ resultsCount: mappedHotels.length, pageSize: PAGE_SIZE, data: paginatedHotels });
  },
  {
    querySchema: z.object({
      searchTerm: z.string().optional(),
      page: z.string().transform((string) => parseInt(string)),
      sort: z.enum(SORT),
      filters: z
        .object({
          isVerified: z.string().transform((string) => string === "true"),
          stars: z.array(z.string().transform((string) => parseInt(string))).optional(),
          rating: z.array(z.string().transform((string) => parseInt(string))).optional(),
          amenities: z.array(z.enum(HOTEL_AMENITIES)).optional(),
          accessibilityAmenities: z.array(z.enum(ACCESSIBILITY_AMENITIES)).optional(),
        })
        .optional(),
    }),
  }
);
