import { db } from "~/db/index";
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
} from "~/db/schema";

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  requestBody.gallery.forEach((item: any) => {
    if (item.thumbnail) {
      item.thumbnail = 1;
    } else {
      item.thumbnail = 0;
    }
  });
  // const result = await db.transaction(async (tx) => {
  //   await tx.insert(builds).values({
  //     code: "25151",
  //     owner: "Agus",
  //     name: "Budi",
  //     benchmark: 1251314,
  //     price_value: 21412549176,
  //   });
  // });
  console.log(requestBody);
  const result = await db.transaction(async (tx) => {
    const build_id = await tx
      .insert(builds)
      .values({
        code: requestBody.code,
        owner: requestBody.owner,
        name: requestBody.name,
        benchmark: requestBody.benchmark,
        price_value: requestBody.price_value,
      })
      .returning({ insertedId: builds.id });
    await tx.insert(teams).values({
      build_id: build_id[0].insertedId,
      cpu: requestBody.team.cpu,
      gpu: requestBody.team.gpu,
    });
    for (let gallery of requestBody.gallery) {
      await tx.insert(galleries).values({
        build_id: build_id[0].insertedId,
        thumbnail: gallery.thumbnail,
        src: gallery.src,
      });
    }
    const specification_id = await tx
      .insert(specifications)
      .values({
        build_id: build_id[0].insertedId,
      })
      .returning({ insertedId: specifications.id });
    await tx.insert(cpus).values({
      specification_id: specification_id[0].insertedId,
      brand: requestBody.specification.cpu.brand,
      model: requestBody.specification.cpu.model,
      socket: requestBody.specification.cpu.socket,
      base_frequency: requestBody.specification.cpu.base_frequency,
    });
    await tx.insert(gpus).values({
      specification_id: specification_id[0].insertedId,
      brand: requestBody.specification.gpu.brand,
      manufacturer: requestBody.specification.gpu.manufacturer,
      model: requestBody.specification.gpu.model,
      memory: requestBody.specification.gpu.memory,
    });
    await tx.insert(motherboards).values({
      specification_id: specification_id[0].insertedId,
      brand: requestBody.specification.motherboard.brand,
      model: requestBody.specification.motherboard.model,
    });
    for (let ram of requestBody.specification.ram) {
      await tx.insert(rams).values({
        specification_id: specification_id[0].insertedId,
        brand: ram.brand,
        model: ram.model,
        size: ram.size,
        quantity: ram.quantity,
      });
    }
    for (let storage of requestBody.specification.storage) {
      await tx.insert(storages).values({
        specification_id: specification_id[0].insertedId,
        brand: storage.brand,
        model: storage.model,
        capacity: storage.capacity,
        quantity: storage.quantity,
      });
    }
    await tx.insert(power_supplies).values({
      specification_id: specification_id[0].insertedId,
      brand: requestBody.specification.power_supply.brand,
      model: requestBody.specification.power_supply.model,
      wattage: requestBody.specification.power_supply.wattage,
    });
    await tx.insert(cpu_coolers).values({
      specification_id: specification_id[0].insertedId,
      brand: requestBody.specification.cpu_cooler.brand,
      model: requestBody.specification.cpu_cooler.model,
      type: requestBody.specification.cpu_cooler.type,
    });
    for (let fan of requestBody.specification.case_fan) {
      await tx.insert(case_fans).values({
        specification_id: specification_id[0].insertedId,
        brand: fan.brand,
        model: fan.model,
        quantity: fan.quantity,
      });
    }
    await tx.insert(cases).values({
      specification_id: specification_id[0].insertedId,
      brand: requestBody.specification.case.brand,
      model: requestBody.specification.case.model,
      form_factor: requestBody.specification.case.form_factor,
    });

    return {
      success: true,};
  });
  console.log(result);
  if (result.success) {
    return { success: true };
  } else {
    return { success: false };
  }
});
