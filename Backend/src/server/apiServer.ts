import express, { Request, Response } from "express";
import cors from "cors";
import { connectToDB } from "../db/db";
import initRouter from '../routes/init';
import tablesRouter from '../routes/tables';

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routs
app.use("/init", initRouter);
app.use("/tables", tablesRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("✅ You are connected to the API Server");
});

const API_PORT = process.env.SERVER_PORT || 5000;

app.listen(API_PORT, () => {
  console.log(`✅ Connected to API Server on port: ${API_PORT}`);
});

connectToDB();