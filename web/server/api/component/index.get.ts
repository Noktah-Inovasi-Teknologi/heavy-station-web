import { useDrizzle } from "~/utils/db/index";
import { components } from "~/utils/db/schema";
import { AsyncParser } from "@json2csv/node";

export default defineEventHandler(async (event) => {
  const query: any = getQuery(event);
  let result: any;
  if (query.export) {
    result = await useDrizzle()
      .select({
        id: components.id,
        slug: components.slug,
      })
      .from(components);

    event.node.res.setHeader("Content-Type", "text/csv");
    event.node.res.setHeader(
      "Content-Disposition",
      "attachment; filename=components.csv"
    );
    return new AsyncParser(result).parse(result).pipe(event.node.res);
  } else {
    result = await useDrizzle().query.components.findMany({
      where: (components, { eq, and, like }) =>
        and(
          eq(components.cat1, query.cat1),
          like(components.name, `%${query.name}%`)
        ),
    });
  }
  return result;
});
