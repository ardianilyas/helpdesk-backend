import { afterAll } from "vitest";
import { pool } from "@/shared/db";

afterAll(async () => {
  await pool.end();
});
