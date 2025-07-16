import express, { Request, Response } from "express";
import { dbClient } from "../db/db";
import { initTablesSQL } from "../db/sql/initSQL";

const router = express.Router();

router.get("/init-tables", async (req: Request, res: Response) => {
  try {
    const result = await dbClient.query(initTablesSQL);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error with initials:", error);
    res.status(500).json({ error: "Error with initials" });
  }
});

export default router;