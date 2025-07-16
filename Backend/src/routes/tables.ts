import express, { Request, Response } from "express";
import { dbClient } from "../db/db";
import { getConfessionsSQL, postNewConfessionSQL } from "../db/sql/tablesSQL";

const router = express.Router();

router.get("/get-confessions", async (req: Request, res: Response) => {
  try {
    const result = await dbClient.query(getConfessionsSQL);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching confessions:", error);
    res.status(500).json({ error: "Error fetching confessions" });
  }
});

router.post("/post-confession", async (req: Request, res: Response) => {
  const { confession, age, sex, category } = req.body;

  if (!confession || !age || !sex || !category) {
    res.status(400).json({ error: "Missing fields in body" });
  }

  try {
    const result = await dbClient.query(postNewConfessionSQL, [
      confession,
      age,
      sex,
      category,
    ]);
    console.log("New post !");
    console.log(
      `The Post: ${confession} by a ${sex} ${age} years old, which categorized to ${category}.`
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error inserting confession:", error);
    res.status(500).json({ error: "Error inserting confession" });
  }
});

export default router;
