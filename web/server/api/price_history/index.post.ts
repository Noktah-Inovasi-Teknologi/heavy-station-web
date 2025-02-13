import csvParser from "csv-parser";
import { Readable } from "stream";
import { useDrizzle } from "~/utils/db/index";
import { price_histories } from "~/utils/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentDate } from "~/server/common/utils";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  if (!files || !files[0]) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }
  const filesStream = Readable.from(files[0].data);
  const parsedData: any[] = [];
  await new Promise((resolve, reject) => {
    filesStream
      .pipe(csvParser())
      .on("data", (row) => parsedData.push(row))
      .on("end", resolve)
      .on("error", reject);
  });
  if (parsedData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Uploaded CSV is empty or invalid",
    });
  }
  const currentDate = getCurrentDate();

  // Transaction
  let insertedIds: number[] = [];
  try {
    for (let row of parsedData) {
      const result = await useDrizzle().insert(price_histories).values({
        component_id: row.Id,
        available: row.Available,
        date: currentDate,
        price: row.Price,
      }).returning({ id: price_histories.id })

      if (result.length > 0) {
        insertedIds.push(result[0].id)
      }
    }
  } catch (error) {
    console.error("Transaction failed:", error);

    if (insertedIds.length > 0) {
      for (let id of insertedIds) {
        await useDrizzle().delete(price_histories).where(eq(price_histories.id, id));
      }
    }

    return { success: false, error };
  }
});
