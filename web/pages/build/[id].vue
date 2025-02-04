<script lang="ts" setup>
import { Galleria } from "primevue";

const route = useRoute();
let isLoaded = ref(false);
let build = ref<any>({});

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
function formatByteSize(size: number) {
  if (size < 1024) {
    return size + " GB";
  } else {
    return (size / 1024).toFixed(2) + " TB";
  }
}
function formatFrequency(frequency: number) {
  return frequency.toFixed(2) + " GHz";
}
async function fetchBuild() {
  build.value = await $fetch("/api/build/" + route.params.id, {
    method: "GET",
  });
  build.value.team = JSON.parse(build.value.team);
  build.value.specifications = JSON.parse(build.value.specifications);
  build.value.galleries = JSON.parse(build.value.galleries);
}

onMounted(async () => {
  await fetchBuild();
  isLoaded.value = true;
});
</script>

<template>
  <Header />
  <div class="p-16 bg-[#202020]" id="content" v-if="isLoaded">
    <div class="w-full bg-[#202020] grid grid-cols-2 gap-[16rem] items-center">
      <Galleria :value="build.galleries" containerStyle="max-width: 48rem">
        <template #item="slotProps">
          <img :src="slotProps.item.src" style="width: 100%" />
        </template>
        <template #thumbnail="slotProps">
          <img :src="slotProps.item.src" style="width: 75%" />
        </template>
      </Galleria>
      <div
        class="h-full py-24 pr-16 flex flex-col justify-between font-kanit font-light text-[#838383]"
      >
        <Team class="mb-8" size="xl" :cpu="build.team.cpu" :gpu="build.team.gpu" />
        <div class="flex flex-col gap-8">
          <div>
            <p>Nama</p>
            <div class="my-2 border-b border-[#3F3F3F]"></div>
            <p class="font-kanit text-5xl text-[#FA1D33]"> {{ build.name }}</p>
          </div>
          <div>
            <p>Kode</p>
            <div class="my-2 border-b border-[#3F3F3F]"></div>
            <p class="font-kanit text-5xl text-[#FA1D33]">{{ build.code }}</p>
          </div>
          <div>
            <p>Benchmark</p>
            <div class="my-2 border-b border-[#3F3F3F]"></div>
            <p class="font-kanit text-5xl text-[#FA1D33]">
              {{ build.benchmark }}
            </p>
          </div>
          <div>
            <p>Harga</p>
            <div class="my-2 border-b border-[#3F3F3F]"></div>
            <p class="font-kanit text-5xl text-[#FA1D33]">
              {{ formatPrice(build.price_value) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <p class="mt-32 mb-16 font-tomorrow text-5xl text-[#FA1D33]">Spesifikasi</p>
    <div class="flex flex-col gap-8" id="specifications">
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">CPU</div>
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Brand"
          :value="build.specifications.cpu.brand"
        />
        <SpecField
          :border="{ l: true, r: true }"
          class="w-full"
          label="Model"
          :value="build.specifications.cpu.model"
        />
        <SpecField
          :border="{ l: true, r: true }"
          class="w-full"
          label="Socket"
          :value="build.specifications.cpu.socket"
        />
        <SpecField
          class="w-full"
          label="Base Frequency"
          :value="formatFrequency(build.specifications.cpu.base_frequency)"
        />
      </div>
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">GPU</div>
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Brand"
          :value="build.specifications.gpu.brand"
        />
        <SpecField
          :border="{ l: true, r: true }"
          class="w-full"
          label="Manufacturer"
          :value="build.specifications.gpu.manufacturer"
        />
        <SpecField
          :border="{ l: true, r: true }"
          class="w-full"
          label="Model"
          :value="build.specifications.gpu.model"
        />
        <SpecField
          class="w-full"
          label="VRAM Size"
          :value="formatByteSize(build.specifications.gpu.memory)"
        />
      </div>
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">
          Motherboard
        </div>
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Brand"
          :value="build.specifications.motherboard.brand"
        />
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Model"
          :value="build.specifications.motherboard.model"
        />
      </div>
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">RAM</div>
        <div class="w-full flex flex-col">
          <div class="w-full flex" v-for="ram in build.specifications.ram">
            <SpecField
              :border="{ l: true }"
              class="w-full"
              label="Brand"
              :value="ram.brand"
            />
            <SpecField
              :border="{ l: true, r: true }"
              class="w-full"
              label="Model"
              :value="ram.model"
            />
            <SpecField
              :border="{ r: true }"
              class="w-full"
              label="Size"
              :value="formatByteSize(ram.size)"
            />
            <SpecField class="w-full" label="Quantity" :value="ram.quantity" />
          </div>
        </div>
      </div>
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">
          Storage
        </div>
        <div class="w-full flex flex-col">
          <div
            class="w-full flex"
            v-for="storage in build.specifications.storage"
          >
            <SpecField
              :border="{ l: true }"
              class="w-full"
              label="Brand"
              :value="storage.brand"
            />
            <SpecField
              :border="{ l: true, r: true }"
              class="w-full"
              label="Model"
              :value="storage.model"
            />
            <SpecField
              :border="{ r: true }"
              class="w-full"
              label="Capacity"
              :value="formatByteSize(storage.capacity)"
            />
            <SpecField
              class="w-full"
              label="Quantity"
              :value="storage.quantity"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">
          Power Supply
        </div>
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Brand"
          :value="build.specifications.power_supply.brand"
        />
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Model"
          :value="build.specifications.power_supply.model"
        />
      </div>
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">
          CPU Cooler
        </div>
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Brand"
          :value="build.specifications.cpu_cooler.brand"
        />
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Model"
          :value="build.specifications.cpu_cooler.model"
        />
      </div>
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">
          Case Fan
        </div>
        <div class="w-full flex flex-col">
          <div class="w-full flex" v-for="fan in build.specifications.case_fan">
            <SpecField
              :border="{ l: true }"
              class="w-full"
              label="Brand"
              :value="fan.brand"
            />
            <SpecField
              :border="{ l: true, r: true }"
              class="w-full"
              label="Model"
              :value="fan.model"
            />
            <SpecField class="w-full" label="Quantity" :value="fan.quantity" />
          </div>
        </div>
      </div>
      <div class="flex items-center border border-[#3F3F3F]">
        <div class="min-w-72 p-8 font-kanit text-[#FA1D33] text-4xl">Case</div>
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Brand"
          :value="build.specifications.case.brand"
        />
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Model"
          :value="build.specifications.case.model"
        />
        <SpecField
          :border="{ l: true }"
          class="w-full"
          label="Maximum Form Factor"
          :value="build.specifications.case.form_factor"
        />
      </div>
    </div>
  </div>
  <Footer />
</template>
