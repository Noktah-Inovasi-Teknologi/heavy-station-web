export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  const db = useDatabase();
  // Create Tables

  await db.sql`CREATE TABLE IF NOT EXISTS builds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    owner TEXT NOT NULL,
    name TEXT NOT NULL,
    benchmark TEXT NOT NULL,
    price_value INTEGER NOT NULL
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    build_id INTEGER NOT NULL,
    cpu TEXT NOT NULL,
    gpu TEXT NOT NULL,
    FOREIGN KEY(build_id) REFERENCES builds(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS specifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    build_id INTEGER NOT NULL,
    FOREIGN KEY(build_id) REFERENCES builds(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS galleries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    build_id INTEGER NOT NULL,
    thumbnail BOOLEAN,
    src TEXT NOT NULL,
    FOREIGN KEY(build_id) REFERENCES builds(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS cpus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    socket TEXT NOT NULL,
    base_frequency INTEGER NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS gpus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    memory INTEGER NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS motherboards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS rams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    size INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS storages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS power_supplies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS cpu_coolers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS case_fans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;
  await db.sql`CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specification_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    form_factor TEXT NOT NULL,
    FOREIGN KEY(specification_id) REFERENCES specifications(id)
  )`;

  // Update Tables

  let complete = false;
  const build_result: any = await db.sql`INSERT INTO builds (
    code,
    owner,
    name,
    benchmark,
    price_value
  ) VALUES (
    ${requestBody.code},
    ${requestBody.owner},
    ${requestBody.name},
    ${requestBody.benchmark},
    ${requestBody.price_value}
  )`;
  if (build_result.success) {
    const lasInsertedItem: any =
      await db.sql`SELECT * FROM builds WHERE code = ${requestBody.code}`;
    const lastId: number = lasInsertedItem.rows[0].id;
    const team_result: any = await db.sql`INSERT INTO teams (
      build_id,
      cpu,
      gpu
    ) VALUES (
      ${lastId},
      ${requestBody.team.cpu},
      ${requestBody.team.gpu}
    )`;
    if (team_result.success) {
      const specification_result: any =
        await db.sql`INSERT INTO specifications (
        build_id
      ) VALUES (
        ${lastId}
      )`;
      if (specification_result.success) {
        const lastSpecificationItem: any =
          await db.sql`SELECT * FROM specifications WHERE build_id = ${lastId}`;
        const lastSpecificationId: number = lastSpecificationItem.rows[0].id;
        const cpu_result: any = await db.sql`INSERT INTO cpus (
          specification_id,
          brand,
          model,
          socket,
          base_frequency 
        ) VALUES (
          ${lastSpecificationId},
          ${requestBody.specification.cpu.brand},
          ${requestBody.specification.cpu.model},
          ${requestBody.specification.cpu.socket},
          ${requestBody.specification.cpu.base_frequency}
        )`;

        if (cpu_result.success) {
          const gpu_result: any = await db.sql`INSERT INTO gpus (
            specification_id,
            brand,
            manufacturer,
            model,
            memory
          ) VALUES (
            ${lastSpecificationId},
            ${requestBody.specification.gpu.brand},
            ${requestBody.specification.gpu.manufacturer},
            ${requestBody.specification.gpu.model},
            ${requestBody.specification.gpu.memory}
          )`;

          if (gpu_result.success) {
            const motherboard_result: any =
              await db.sql`INSERT INTO motherboards (
              specification_id,
              brand,
              model
            ) VALUES (
              ${lastSpecificationId},
              ${requestBody.specification.motherboard.brand},
              ${requestBody.specification.motherboard.model}
            )`;

            if (motherboard_result.success) {
              let results: any = [];
              for (let ram of requestBody.specification.ram) {
                const ram_result: any = await db.sql`INSERT INTO rams (
                  specification_id,
                  brand,
                  model,
                  size,
                  quantity
                ) VALUES (
                  ${lastSpecificationId},
                  ${ram.brand},
                  ${ram.model},
                  ${ram.size},
                  ${ram.quantity}
                )`;
                results.push(ram_result);
              }

              if (results.every((result: any) => result.success)) {
                results = [];
                for (let storage of requestBody.specification.storage) {
                  const storage_result: any =
                    await db.sql`INSERT INTO storages (
                    specification_id,
                    brand,
                    model,
                    capacity,
                    quantity
                  ) VALUES (
                    ${lastSpecificationId},
                    ${storage.brand},
                    ${storage.model},
                    ${storage.capacity},
                    ${storage.quantity}
                  )`;
                  results.push(storage_result);
                }

                if (results.every((result: any) => result.success)) {
                  const power_supply_result: any =
                    await db.sql`INSERT INTO power_supplies (
                    specification_id,
                    brand,
                    model
                  ) VALUES (
                    ${lastSpecificationId},
                    ${requestBody.specification.power_supply.brand},
                    ${requestBody.specification.power_supply.model}
                  )`;

                  if (power_supply_result.success) {
                    const cpu_cooler_result: any =
                      await db.sql`INSERT INTO cpu_coolers (
                      specification_id,
                      brand,
                      model
                    ) VALUES (
                      ${lastSpecificationId},
                      ${requestBody.specification.cpu_cooler.brand},
                      ${requestBody.specification.cpu_cooler.model}
                    )`;

                    if (cpu_cooler_result.success) {
                      results = [];
                      for (let case_fan of requestBody.specification.case_fan) {
                        const case_fan_result: any =
                          await db.sql`INSERT INTO case_fans (
                          specification_id,
                          brand,
                          model,
                          quantity
                        ) VALUES (
                          ${lastSpecificationId},
                          ${case_fan.brand},
                          ${case_fan.model},
                          ${case_fan.quantity}
                        )`;
                        results.push(case_fan_result);
                      }

                      if (results.every((result: any) => result.success)) {
                        const case_result: any =
                          await db.sql`INSERT INTO cases (
                          specification_id,
                          brand,
                          model,
                          form_factor
                        ) VALUES (
                          ${lastSpecificationId},
                          ${requestBody.specification.case.brand},
                          ${requestBody.specification.case.model},
                          ${requestBody.specification.case.form_factor}
                        )`;

                        if (case_result.success) {
                          results = [];
                          for (let gallery of requestBody.gallery) {
                            const gallery_result: any =
                              await db.sql`INSERT INTO galleries (
                              build_id,
                              thumbnail,
                              src
                            ) VALUES (
                              ${lastId},
                              ${gallery.thumbnail ? 1 : 0},
                              ${gallery.src}
                            )`;
                            results.push(gallery_result);
                          }

                          if (results.every((result: any) => result.success)) {
                            complete = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  let whole_result: any = [];
  if (complete) {
    whole_result = await db.sql`SELECT
    builds.id AS build_id,
    builds.code,
    builds.owner,
    builds.name,
    builds.benchmark,
    builds.price_value,
    teams.cpu AS team_cpu,
    teams.gpu AS team_gpu,
    specifications.id AS specification_id,
    cpus.brand AS cpu_brand,
    cpus.model AS cpu_model,
    gpus.brand AS gpu_brand,
    gpus.model AS gpu_model,
    motherboards.brand AS motherboard_brand,
    motherboards.model AS motherboard_model,
    power_supplies.brand AS power_supply_brand,
    power_supplies.model AS power_supply_model,
    cpu_coolers.brand AS cpu_cooler_brand,
    cpu_coolers.model AS cpu_cooler_model,
    cases.brand AS case_brand,
    cases.model AS case_model,
    GROUP_CONCAT(DISTINCT rams.brand || '|' || rams.model || '|' || rams.size || '|' || rams.quantity) AS rams,
    GROUP_CONCAT(DISTINCT storages.brand || '|' || storages.model || '|' || storages.capacity) AS storages,
    GROUP_CONCAT(DISTINCT galleries.thumbnail || '|' || galleries.src) AS galleries
FROM builds
LEFT JOIN teams ON builds.id = teams.build_id
LEFT JOIN specifications ON builds.id = specifications.build_id
LEFT JOIN cpus ON specifications.id = cpus.specification_id
LEFT JOIN gpus ON specifications.id = gpus.specification_id
LEFT JOIN motherboards ON specifications.id = motherboards.specification_id
LEFT JOIN rams ON specifications.id = rams.specification_id
LEFT JOIN storages ON specifications.id = storages.specification_id
LEFT JOIN power_supplies ON specifications.id = power_supplies.specification_id
LEFT JOIN cpu_coolers ON specifications.id = cpu_coolers.specification_id
LEFT JOIN case_fans ON specifications.id = case_fans.specification_id
LEFT JOIN cases ON specifications.id = cases.specification_id
LEFT JOIN galleries ON builds.id = galleries.build_id
WHERE builds.code = ${requestBody.code}
GROUP BY builds.id`;
  }

  console.log(whole_result);
});
