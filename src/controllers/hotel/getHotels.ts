import { databaseService } from "@services";
import { toDTOHotel } from "./toDTOHotel";
import { controller } from "../common/controller";
import { DTOHotel } from "../model/DTOHotel";
import { z } from "zod";
import { ACCESSIBILITY_AMENITIES, HOTEL_AMENITIES } from "@constants";

const SORT = ["name", "rating", "stars"] as const;

const PAGE_SIZE = 20;

type Filters = {
  isVerified?: DTOHotel["isVerified"];
  stars?: number[];
  rating?: number[];
  amenities?: DTOHotel["amenities"];
  accessibilityAmenities?: DTOHotel["accessibilityAmenities"];
};

type Query = {
  page: number;
  searchTerm?: string;
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

    const { stars, rating, amenities, accessibilityAmenities } = filters ?? {};

    if (filters?.isVerified) {
      mappedHotels = mappedHotels.filter((hotel) => hotel.isVerified);
    }
    if (stars) {
      mappedHotels = mappedHotels.filter((hotel) => stars.includes(hotel.stars));
    }
    if (rating) {
      mappedHotels = mappedHotels.filter((hotel) => rating.includes(hotel.rating ?? 0));
    }
    if (amenities) {
      mappedHotels = mappedHotels.filter((hotel) =>
        amenities.every((amenity) => hotel.amenities.includes(amenity))
      );
    }
    if (accessibilityAmenities) {
      mappedHotels = mappedHotels.filter((hotel) =>
        accessibilityAmenities.every((amenity) => hotel.accessibilityAmenities.includes(amenity))
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
