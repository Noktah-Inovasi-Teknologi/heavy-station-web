import { drizzle } from "drizzle-orm/d1";
import * as schema from "~/utils/db/schema";

// const db = createDatabase(sqlite({}));
export function useDrizzle() {
    return drizzle(hubDatabase(), { schema });
}

export const db = useDrizzle()
// export const db = drizzle(hubDatabase(), { schema });
 

// migrate(useDrizzle(), { migrationsFolder: "db/migrations" });
