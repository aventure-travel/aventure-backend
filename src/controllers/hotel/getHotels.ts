import { databaseService } from "@services";
import express from "express";
import { toDTOHotel } from "./toDTOHotel";

export const getHotels = async (req: express.Request, res: express.Response) => {
  const city = req.query.city ?? "";

  if (typeof city !== "string") {
    res.status(400).send("error");
    return;
  }

  const hotels = await databaseService.findHotelsByCity(city);

  const mappedHotels = await Promise.all(hotels.map(toDTOHotel));

  console.log(mappedHotels[0].reviews[0]);

  res.status(200).json(mappedHotels);
};