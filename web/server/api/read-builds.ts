export default defineEventHandler(async (event) => {
  const query: any = getQuery(event);
  const offset = (query.page - 1) * query.page_size;
  const db = useDatabase();

  const { rows } = await db.sql`
  SELECT 
    builds.id,
    builds.code,
    builds.name,
    builds.benchmark,
    builds.price_value,
    JSON_OBJECT(
      'cpu', teams.cpu,
      'gpu', teams.gpu
    ) AS team,
    JSON_GROUP_ARRAY(
      JSON_OBJECT(
        'thumbnail', galleries.thumbnail,
        'src', galleries.src
      )
    ) AS galleries
  FROM 
    builds
  LEFT JOIN
    teams ON builds.id = teams.build_id
  LEFT JOIN 
    galleries ON builds.id = galleries.build_id
  GROUP BY 
    builds.id
  LIMIT 
    ${query.page_size}
  OFFSET 
    ${offset};
  `;

  return rows;
});
