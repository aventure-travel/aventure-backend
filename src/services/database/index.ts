import { findUserByEmail, findUserById } from "./user/findUser";
import { findRestaurantById } from "./restaurant/findRestaurant";
import { findHotelById } from "./hotel/findHotel";
import { createUser } from "./user/createUser";
import { updateUserById } from "./user/updateUser";
import { connectDB } from "./common";
import { createBlogPost } from "./blogPost/createBlogPost";
import { findBlogPostById } from "./blogPost/findBlogPostById";
import { findBlogPostsByTitle } from "./blogPost/findBlogPostsByTitle";
import { findHotelsByCity } from "./hotel/findHotelByCity";
import { createHotelReview } from "./hotel/createHotelReview";
import { createBlogComment } from "./blogPost/createBlogComment";
import { findTrainStations } from "./train/findTrainStations";
import { findTrainStation, findTrainStationByDbStationId } from "./train/findTrainStation";
import { findRestaurantsByCity } from "./restaurant/findRestaurantsbyCity";
import { createRestaurantReview } from "./restaurant/createRestaurantReview";
import { createRestaurantAccessibilityVerification } from "./verification/createRestaurantAccessibilityVerification";
import { createHotelAccessibilityVerification } from "./verification/createHotelAccessibilityVerification";

export const databaseService = {
  // <-- COMMON -->
  connectDB,
  // <-- USER -->
  findUserById,
  findUserByEmail,
  createUser,
  updateUserById,
  // <-- RESTAURANT -->
  findRestaurantById,
  findRestaurantsByCity,
  createRestaurantReview,
  // <-- HOTEL -->
  findHotelById,
  findHotelsByCity,
  createHotelReview,
  // <-- BLOG -->
  createBlogPost,
  createBlogComment,
  findBlogPostById,
  findBlogPostsByTitle,
  // <-- Train -->
  findTrainStations,
  findTrainStation,
  findTrainStationByDbStationId,
  // <-- Verification -->
  createHotelAccessibilityVerification,
  createRestaurantAccessibilityVerification,
};
