import { db } from "~/utils/db/index";
import { builds } from "~/utils/db/schema";
import { teams, galleries } from "~/utils/db/schema";
import { eq, sql } from "drizzle-orm";
import { SQLiteRaw } from "drizzle-orm/sqlite-core/query-builders/raw";

export default defineEventHandler(async (event) => {
  const query: any = getQuery(event);
  query.page_size = Number(query.page_size);
  const offset = Number(query.page - 1) * query.page_size;
  const result = await db
    .select({
      id: builds.id,
      code: builds.code,
      name: builds.name,
      benchmark: builds.benchmark,
      price_value: builds.price_value,
      team: sql
        .raw(`JSON_OBJECT('cpu', teams.cpu, 'gpu', teams.gpu)`)
        .as("team"),
      galleries: sql
        .raw(
          `JSON_GROUP_ARRAY(JSON_OBJECT('thumbnail', galleries.thumbnail, 'src', galleries.src))`
        )
        .as("galleries"),
    })
    .from(builds)
    .leftJoin(teams, eq(teams.build_id, builds.id))
    .leftJoin(galleries, eq(galleries.build_id, builds.id))
    .groupBy(builds.id)
    .limit(query.page_size)
    .offset(offset);
  return result;
});
