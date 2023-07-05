import { MongooseHotel } from "../model/MongooseHotel";

export const findHotelById = async (hotelId: string): Promise<any> => {
  const hotel = await MongooseHotel.findById(hotelId);

  if (hotel) {
    return hotel;
  }

  console.log(`No hotel found with the id '${hotelId}'`);

  return null;
};
