export default defineEventHandler(async () => {
  const db = useDatabase();
  const result: any = await db.sql`
    SELECT
      COUNT(*) AS total
    FROM
      builds
    `;

  return result.rows[0].total;
});
