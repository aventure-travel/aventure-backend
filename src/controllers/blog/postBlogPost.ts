import { databaseService } from "@services";
import express from "express";
import { AuthenticatedRequest } from "../model/AuthenticatedRequest";

export const postBlogPost = async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { userId } = req;
    const newBlogPost = req.body;

    if (typeof userId !== "string") {
      // TODO better error mapping
      res.status(400).send("no user id provided");
      return;
    }

    // TODO add correct authorId from request-headers
    await databaseService.createBlogPost({ authorId: userId, ...newBlogPost });

    res.status(200).send("OK");
  } catch (error) {
    res.status(400).send(error);
  }
};
