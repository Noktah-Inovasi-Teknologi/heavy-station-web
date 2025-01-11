export default defineEventHandler(async (event) => {
    const params = getRouterParams(event);
    const db = useDatabase();
    const result: any = await db.sql`
    SELECT
      builds.id,
      builds.code,
      builds.owner,
      builds.name,
      builds.benchmark,
      builds.price_value,
      JSON_OBJECT(
        'cpu', teams.cpu,
        'gpu', teams.gpu
      ) AS team,
      JSON_OBJECT(
        'id', specifications.id,
        'cpu', JSON_OBJECT(
          'brand', cpus.brand,
          'model', cpus.model,
          'socket', cpus.socket,
          'base_frequency', cpus.base_frequency
        ),
        'gpu', JSON_OBJECT(
          'brand', gpus.brand,
          'manufacturer', gpus.manufacturer,
          'model', gpus.model,
          'memory', gpus.memory
        ),
        'motherboard', JSON_OBJECT(
          'brand', motherboards.brand,
          'model', motherboards.model
        ),
        'ram', JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'brand', rams.brand,
            'model', rams.model,
            'size', rams.size,
            'quantity', rams.quantity
          )
        ),
        'storage', JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'brand', storages.brand,
            'model', storages.model,
            'capacity', storages.capacity,
            'quantity', storages.quantity
          )
        ),
        'power_supply', JSON_OBJECT(
          'brand', power_supplies.brand,
          'model', power_supplies.model
        ),
        'cpu_cooler', JSON_OBJECT(
          'brand', cpu_coolers.brand,
          'model', cpu_coolers.model
        ),
        'case_fan', JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'brand', case_fans.brand,
            'model', case_fans.model,
            'quantity', case_fans.quantity
          )
        ),
        'case', JSON_OBJECT(
          'brand', cases.brand,
          'model', cases.model,
          'form_factor', cases.form_factor
        )
      ) AS specifications,
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
      specifications ON builds.id = specifications.build_id
    LEFT JOIN 
      cpus ON specifications.id = cpus.specification_id
    LEFT JOIN 
      gpus ON specifications.id = gpus.specification_id
    LEFT JOIN 
      motherboards ON specifications.id = motherboards.specification_id
    LEFT JOIN 
      rams ON specifications.id = rams.specification_id
    LEFT JOIN 
      storages ON specifications.id = storages.specification_id
    LEFT JOIN 
      power_supplies ON specifications.id = power_supplies.specification_id
    LEFT JOIN 
      cpu_coolers ON specifications.id = cpu_coolers.specification_id
    LEFT JOIN 
      case_fans ON specifications.id = case_fans.specification_id
    LEFT JOIN 
      cases ON specifications.id = cases.specification_id
    LEFT JOIN 
      galleries ON builds.id = galleries.build_id
    WHERE
      builds.id = ${params.id}
    `

    return result.rows[0];
})