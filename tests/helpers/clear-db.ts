import { db } from "../../src/shared/db";
import { reset } from "drizzle-seed";
import * as schema from "@/shared/db/schemas";

export async function clearDb() {
  await reset(db, schema);
}
