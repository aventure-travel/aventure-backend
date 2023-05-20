import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import {userRouter} from "./modules/user";
import {databaseService} from "./services/database";

dotenv.config();

const app = express();

app.use(express.json())

app.use("/v1/user", userRouter);

// TODO handle errors app.use(handleErrors);

app.listen(Number(process.env.PORT), "0.0.0.0", () => {
    console.log(`⚡️[server]: Server is running on port ${Number(process.env.PORT)}`);
});