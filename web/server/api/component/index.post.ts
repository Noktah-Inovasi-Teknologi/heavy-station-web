import csvParser from "csv-parser";
import { Readable } from "stream";
import { useDrizzle } from "~/utils/db/index";
import { components } from "~/utils/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  if (!files || !files[0]) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }
  const filesStream = Readable.from(files[0].data);
  const parsedData:any[] = [];
  await new Promise((resolve, reject) => {
    filesStream
      .pipe(csvParser())
      .on("data", (row) => parsedData.push(row))
      .on("end", resolve)
      .on("error", reject);
  });
  if (parsedData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "Uploaded CSV is empty or invalid" });
  }

  // Transaction
  let insertedIds: number[] = []
  try {
    for (let row of parsedData) {
      const result = await useDrizzle().insert(components).values({
        name: row.Produk,
        slug: row.Slug,
        link: row.Link,
        cat1: row.Category1,
        cat2: row.Category2,
        cat3: row.Category3,
      }).returning({ id: components.id })

      if (result.length > 0) {
        insertedIds.push(result[0].id)
      }
    }
  } catch (error) {
    console.error("Transaction failed:", error);

    if (insertedIds.length > 0) {
      for (let id of insertedIds) {
        await useDrizzle().delete(components).where(eq(components.id, id));
      }
    }

    return { success: false, error };
  }

  // const result = await db.transaction(async (tx) => {
  //   for (const row of parsedData) {
  //     await tx.insert(components).values({
  //       name: row.Produk,
  //       slug: row.Slug,
  //       link: row.Link,
  //       cat1: row.Category1,
  //       cat2: row.Category2,
  //       cat3: row.Category3,
  //     });
  //   }

  //   return { success: true };
  // })

  // if (result?.success) {
  //   return { success: true };
  // } else {
  //   return { success: false };
  // }
});