import { drizzle } from "drizzle-orm/d1";
import * as schema from "~/utils/db/schema";

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}
