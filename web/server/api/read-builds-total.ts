import { db } from "~/db/index";
import { builds } from "~/db/schema";

export default defineEventHandler(async () => {
  const result: any = await db.$count(builds);
  return result;
});
