import { useDrizzle } from "~/utils/db/index";
import {
  builds,
  teams,
  specifications,
  galleries,
  cpus,
  gpus,
  motherboards,
  rams,
  storages,
  power_supplies,
  cpu_coolers,
  case_fans,
  cases,
} from "~/utils/db/schema";
import { insertRow, rollbackRows } from "~/server/common/utils";

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  requestBody.gallery.forEach((item: any) => {
    if (item.thumbnail) {
      item.thumbnail = 1;
    } else {
      item.thumbnail = 0;
    }
  });

  // Transaction
  const insertedIds: Record<string, any> = {
    build_id: [],
    specification_id: [],
    teams: [],
    galleries: [],
    cpus: [],
    gpus: [],
    motherboards: [],
    rams: [],
    storages: [],
    power_supplies: [],
    cpu_coolers: [],
    case_fans: [],
    cases: [],
  };
  try {
    // Insert into builds table
    const buildResult = await useDrizzle()
      .insert(builds)
      .values({
        code: requestBody.code,
        owner: requestBody.owner,
        name: requestBody.name,
        benchmark: requestBody.benchmark,
        price_value: requestBody.price_value,
      })
      .returning({ id: builds.id });

    if (buildResult.length === 0) throw new Error("Failed to insert build");
    insertedIds.build_id.push(buildResult[0].id);

    // Insert into teams table
    const teamResult = await useDrizzle().insert(teams).values({
      build_id: insertedIds.build_id,
      cpu: requestBody.team.cpu,
      gpu: requestBody.team.gpu,
    });
    insertedIds.teams.push(insertedIds.build_id);

    // Insert into galleries
    for (let gallery of requestBody.gallery) {
      const galleryResult = await useDrizzle()
        .insert(galleries)
        .values({
          build_id: insertedIds.build_id,
          thumbnail: gallery.thumbnail,
          src: gallery.src,
        })
        .returning({ id: galleries.id });

      insertedIds.galleries.push(galleryResult[0].id);
    }

    // Insert into specifications
    const specResult = await useDrizzle()
      .insert(specifications)
      .values({
        build_id: insertedIds.build_id,
      })
      .returning({ id: specifications.id });

    if (specResult.length === 0)
      throw new Error("Failed to insert specifications");
    insertedIds.specification_id = specResult[0].id;

    // Insert CPU
    const cpuResult = await useDrizzle()
      .insert(cpus)
      .values({
        specification_id: insertedIds.specification_id,
        brand: requestBody.specification.cpu.brand,
        model: requestBody.specification.cpu.model,
        socket: requestBody.specification.cpu.socket,
        base_frequency: requestBody.specification.cpu.base_frequency,
      })
      .returning({ id: cpus.id });

    insertedIds.cpus.push(cpuResult[0].id);

    // Insert GPU
    const gpuResult = await useDrizzle()
      .insert(gpus)
      .values({
        specification_id: insertedIds.specification_id,
        brand: requestBody.specification.gpu.brand,
        manufacturer: requestBody.specification.gpu.manufacturer,
        model: requestBody.specification.gpu.model,
        memory: requestBody.specification.gpu.memory,
      })
      .returning({ id: gpus.id });

    insertedIds.gpus.push(gpuResult[0].id);

    // Insert Motherboard
    const moboResult = await useDrizzle()
      .insert(motherboards)
      .values({
        specification_id: insertedIds.specification_id,
        brand: requestBody.specification.motherboard.brand,
        model: requestBody.specification.motherboard.model,
      })
      .returning({ id: motherboards.id });

    insertedIds.motherboards.push(moboResult[0].id);

    // Insert RAMs
    for (let ram of requestBody.specification.ram) {
      const ramResult = await useDrizzle()
        .insert(rams)
        .values({
          specification_id: insertedIds.specification_id,
          brand: ram.brand,
          model: ram.model,
          size: ram.size,
          quantity: ram.quantity,
        })
        .returning({ id: rams.id });

      insertedIds.rams.push(ramResult[0].id);
    }

    // Insert Storage
    for (let storage of requestBody.specification.storage) {
      const storageResult = await useDrizzle()
        .insert(storages)
        .values({
          specification_id: insertedIds.specification_id,
          brand: storage.brand,
          model: storage.model,
          capacity: storage.capacity,
          quantity: storage.quantity,
        })
        .returning({ id: storages.id });

      insertedIds.storages.push(storageResult[0].id);
    }

    // Insert Power Supply
    const psuResult = await useDrizzle()
      .insert(power_supplies)
      .values({
        specification_id: insertedIds.specification_id,
        brand: requestBody.specification.power_supply.brand,
        model: requestBody.specification.power_supply.model,
        wattage: requestBody.specification.power_supply.wattage,
      })
      .returning({ id: power_supplies.id });

    insertedIds.power_supplies.push(psuResult[0].id);

    // Insert CPU Cooler
    const coolerResult = await useDrizzle()
      .insert(cpu_coolers)
      .values({
        specification_id: insertedIds.specification_id,
        brand: requestBody.specification.cpu_cooler.brand,
        model: requestBody.specification.cpu_cooler.model,
        type: requestBody.specification.cpu_cooler.type,
      })
      .returning({ id: cpu_coolers.id });

    insertedIds.cpu_coolers.push(coolerResult[0].id);

    // Insert Case Fans
    for (let fan of requestBody.specification.case_fan) {
      const fanResult = await useDrizzle()
        .insert(case_fans)
        .values({
          specification_id: insertedIds.specification_id,
          brand: fan.brand,
          model: fan.model,
          quantity: fan.quantity,
        })
        .returning({ id: case_fans.id });

      insertedIds.case_fans.push(fanResult[0].id);
    }

    // Insert Case
    insertedIds.cases = insertRow(
      "cases",
      {
        specification_id: insertedIds.specification_id,
        brand: requestBody.specification.case.brand,
        model: requestBody.specification.case.model,
        form_factor: requestBody.specification.case.form_factor,
      },
      insertedIds.cases
    );

    return { success: true };
  } catch (error) {
    console.error("Transaction failed:", error);

    // Rollback operations
    rollbackRows("cases", insertedIds.cases);
    rollbackRows("case_fans", insertedIds.case_fans);
    rollbackRows("cpu_coolers", insertedIds.cpu_coolers);
    rollbackRows("power_supplies", insertedIds.power_supplies);
    rollbackRows("storages", insertedIds.storages);
    rollbackRows("rams", insertedIds.rams);
    rollbackRows("motherboards", insertedIds.motherboards);
    rollbackRows("gpus", insertedIds.gpus);
    rollbackRows("cpus", insertedIds.cpus);
    rollbackRows("specifications", insertedIds.specification_id);
    rollbackRows("galleries", insertedIds.galleries);
    rollbackRows("teams", insertedIds.teams);
    rollbackRows("builds", insertedIds.build_id);

    return { success: false, error };
  }

  // const result = await useDrizzle().transaction(async (tx) => {
  //   const build_id = await tx
  //     .insert(builds)
  //     .values({
  //       code: requestBody.code,
  //       owner: requestBody.owner,
  //       name: requestBody.name,
  //       benchmark: requestBody.benchmark,
  //       price_value: requestBody.price_value,
  //     })
  //     .returning({ insertedId: builds.id });
  //   await tx.insert(teams).values({
  //     build_id: build_id[0].insertedId,
  //     cpu: requestBody.team.cpu,
  //     gpu: requestBody.team.gpu,
  //   });
  //   for (let gallery of requestBody.gallery) {
  //     await tx.insert(galleries).values({
  //       build_id: build_id[0].insertedId,
  //       thumbnail: gallery.thumbnail,
  //       src: gallery.src,
  //     });
  //   }
  //   const specification_id = await tx
  //     .insert(specifications)
  //     .values({
  //       build_id: build_id[0].insertedId,
  //     })
  //     .returning({ insertedId: specifications.id });
  //   await tx.insert(cpus).values({
  //     specification_id: specification_id[0].insertedId,
  //     brand: requestBody.specification.cpu.brand,
  //     model: requestBody.specification.cpu.model,
  //     socket: requestBody.specification.cpu.socket,
  //     base_frequency: requestBody.specification.cpu.base_frequency,
  //   });
  //   await tx.insert(gpus).values({
  //     specification_id: specification_id[0].insertedId,
  //     brand: requestBody.specification.gpu.brand,
  //     manufacturer: requestBody.specification.gpu.manufacturer,
  //     model: requestBody.specification.gpu.model,
  //     memory: requestBody.specification.gpu.memory,
  //   });
  //   await tx.insert(motherboards).values({
  //     specification_id: specification_id[0].insertedId,
  //     brand: requestBody.specification.motherboard.brand,
  //     model: requestBody.specification.motherboard.model,
  //   });
  //   for (let ram of requestBody.specification.ram) {
  //     await tx.insert(rams).values({
  //       specification_id: specification_id[0].insertedId,
  //       brand: ram.brand,
  //       model: ram.model,
  //       size: ram.size,
  //       quantity: ram.quantity,
  //     });
  //   }
  //   for (let storage of requestBody.specification.storage) {
  //     await tx.insert(storages).values({
  //       specification_id: specification_id[0].insertedId,
  //       brand: storage.brand,
  //       model: storage.model,
  //       capacity: storage.capacity,
  //       quantity: storage.quantity,
  //     });
  //   }
  //   await tx.insert(power_supplies).values({
  //     specification_id: specification_id[0].insertedId,
  //     brand: requestBody.specification.power_supply.brand,
  //     model: requestBody.specification.power_supply.model,
  //     wattage: requestBody.specification.power_supply.wattage,
  //   });
  //   await tx.insert(cpu_coolers).values({
  //     specification_id: specification_id[0].insertedId,
  //     brand: requestBody.specification.cpu_cooler.brand,
  //     model: requestBody.specification.cpu_cooler.model,
  //     type: requestBody.specification.cpu_cooler.type,
  //   });
  //   for (let fan of requestBody.specification.case_fan) {
  //     await tx.insert(case_fans).values({
  //       specification_id: specification_id[0].insertedId,
  //       brand: fan.brand,
  //       model: fan.model,
  //       quantity: fan.quantity,
  //     });
  //   }
  //   await tx.insert(cases).values({
  //     specification_id: specification_id[0].insertedId,
  //     brand: requestBody.specification.case.brand,
  //     model: requestBody.specification.case.model,
  //     form_factor: requestBody.specification.case.form_factor,
  //   });

  //   return {
  //     success: true,};
  // });
  // console.log(result);
  // if (result.success) {
  //   return { success: true };
  // } else {
  //   return { success: false };
  // }
});
