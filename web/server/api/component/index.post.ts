import csvParser from "csv-parser";
import { Readable } from "stream";
import { db } from "~/db/index";
import { components } from "~/db/schema";

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
  const result = await db.transaction(async (tx) => {
    for (const row of parsedData) {
      await tx.insert(components).values({
        name: row.Produk,
        slug: row.Slug,
        link: row.Link,
        cat1: row.Category1,
        cat2: row.Category2,
        cat3: row.Category3,
      });
    }

    return { success: true };
  })

  if (result?.success) {
    return { success: true };
  } else {
    return { success: false };
  }
});