import { useDrizzle } from "~/utils/db";
import { eq } from "drizzle-orm";
import * as schema from "~/utils/db/schema";

export function getCurrentDate(): Date {
  // This function will set the time to 07:00 WIB or 00:00 UTC
  // Get current date adjusted to Indonesia's time zone (e.g., Asia/Jakarta)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(new Date());
  
  // Extract local date components
  const year = parts.find(p => p.type === 'year')!.value;
  const month = parts.find(p => p.type === 'month')!.value;
  const day = parts.find(p => p.type === 'day')!.value;

  // Create a Date object in Indonesia's local time at midnight (00:00)
  const localDate = new Date(`${year}-${month}-${day}T00:00:00+07:00`);

  // Return the Unix time (milliseconds since 1970-01-01T00:00:00Z)
  return localDate;
}

export async function insertRow<T extends keyof typeof schema>(table: T, values: any, containerInsertedIds: Array<any>) {
  let result = await useDrizzle().insert(schema[table]).values(values).returning({ id: schema[table].id });
  return containerInsertedIds.push(result[0].id);
}

export async function rollbackRows<T extends keyof typeof schema>(
  table: T,
  rows: Array<number>
) {
  if (rows.length === 1) {
    await useDrizzle().delete(schema[table]).where(eq(schema[table].id, rows[0]));
  } else if (rows.length > 1) {
    for (const row of rows) {
      await useDrizzle().delete(schema[table]).where(eq(schema[table].id, row));
    }
  }
}
