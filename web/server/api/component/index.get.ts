import { db } from "~/utils/db/index";

export default defineEventHandler(async (event) => {
  const query: any = getQuery(event);
  const result = await db.query.components.findMany({
    where: (components, { eq, and, like }) =>
      and(eq(components.cat1, query.cat1), like(components.name, `%${query.name}%`))
  });
  return result;
});
