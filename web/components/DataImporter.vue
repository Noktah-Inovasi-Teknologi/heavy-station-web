<script lang="ts" setup>
import { useToast } from 'primevue';
const isLoaded = ref(false);
const toast = useToast();


let code = ref("");
let owner = ref("");
let name = ref("");
let benchmark = ref("");
let price_value = ref(0);
let team = ref({
  cpu: "",
  gpu: "",
});
let specification = ref<Record<string, any>>({
  cpu: {
    brand: "",
    model: "",
    socket: "",
    base_frequency: 0,
  },
  gpu: {
    brand: "",
    manufacturer: "",
    model: "",
    memory: 0,
  },
  motherboard: {
    brand: "",
    model: "",
  },
  ram: [],
  storage: [],
  power_supply: {
    brand: "",
    model: "",
    wattage: ""
  },
  cpu_cooler: {
    brand: "",
    model: "",
    type: "",
  },
  case_fan: [],
  case: {
    brand: "",
    model: "",
    form_factor: "",
  },
});
let galleries = ref<Record<string, any>[]>([]);

let fileComponentCSV = ref();

// Options
const teamOptions = [
  { label: "AMD", value: "amd" },
  { label: "Intel", value: "intel" },
  { label: "NVIDIA", value: "nvidia" },
];
const cpuBrandOptions = [
  { label: "AMD", value: "amd" },
  { label: "Intel", value: "intel" },
];
const cpuSocketOptions = [
  {
    label: "Intel",
    items: [
      { label: "LGA 1700 (12th, 13th, 14th)", value: "lga-1700"},
      { label: "LGA 1200 (10th, 11th)", value: "lga-1200"},
      { label: "LGA 1151 (6th, 7th, 8th, 9th)", value: "lga-1151"},
      { label: "LGA 1150 (4th, 5th)", value: "lga-1150"},
      { label: "LGA 2066 (Skylake-X, Cascade Lake-X)", value: "lga-2066"},
      { label: "LGA 3647 (Xeon, Core-X)", value: "lga-3647"}
    ]
  },
  {
    label: "AMD",
    items: [
      { label: "AM5 (7k, 8k, 9k)", value: "am5"},
      { label: "AM4 (1k, 2k, 3k, 4k, 5k, 6k)", value: "am4"},
      { label: "sTRX4 (Threadripper)", value: "strx4"},
      { label: "SP3 (EPYC)", value: "sp3"}
    ]
  }
]
const gpuBrandOptions = [
  {
    label: "AMD",
    items: [
      { label: "ASUS", value: "asus"},
      { label: "ASRock", value: "asrock" },
      { label: "MSI", value: "msi"},
      { label: "Gigabyte", value: "gigabyte"},
      { label: "Sapphire", value: "sapphire"},
      { label: "PowerColor", value: "powercolor"},
      { label: "XFX", value: "xfx"},
      { label: "VisionTek", value: "visiontek"},
      { label: "Biostar", value: "biostar"},
      { label: "AFOX", value: "afox"},
    ]
  },
  {
    label: "Intel",
    items: [
      { label: "ASUS", value: "asus"},
      { label: "MSI", value: "msi"},
      { label: "Gigabyte", value: "gigabyte"},
      { label: "Gunnir", value: "gunnir"},
      { label: "Acer", value: "acer"},
      { label: "ASRock", value: "asrock"},
      { label: "Sapphire", value: "sapphire"},
    ]
  },
  {
    label: "NVIDIA",
    items: [
      { label: "ASUS", value: "asus" },
      { label: "MSI", value: "msi" },
      { label: "Gigabyte", value: "gigabyte" },
      { label: "ZOTAC", value: "zotac" },
      { label: "EVGA", value: "evga" },
      { label: "Palit", value: "palit" },
      { label: "PNY", value: "pny" },
      { label: "Inno3D", value: "inno3d" },
      { label: "Colorful", value: "colorful" },
      { label: "GALAX", value: "galax" },
      { label: "Manli", value: "manli" },
    ]
  },
  
]
const gpuManufacturerOptions = [
  { label: "AMD", value: "amd" },
  { label: "NVIDIA", value: "nvidia" },
  { label: "Intel", value: "intel" },
]
const motherboardFormFactorOptions = [
  { label: "ATX", value: "ATX" },
  { label: "Micro ATX", value: "micro-atx" },
  { label: "Mini ITX", value: "mini-itx" },
  { label: "Extended ATX", value: "extended-atx" },
  { label: "Extra Large ATX", value: "extra-large-atx" },
];
const cpuCoolerTypeOptions = [
  { label: "Air", value: "air" },
  { label: "AIO Liquid", value: "liquid-aio" },
  { label: "Custom Water-Cooling", value: "liquid-custom" },
]

function addRam() {
  specification.value.ram.push({
    brand: "",
    model: "",
    size: 0,
    quantity: 0,
  });
}
function removeRam(index: number) {
  specification.value.ram.splice(index, 1);
}
function addStorage() {
  specification.value.storage.push({
    brand: "",
    model: "",
    capacity: 0,
    quantity: 0,
  });
}
function removeStorage(index: number) {
  specification.value.storage.splice(index, 1);
}
function addCaseFan() {
  specification.value.case_fan.push({
    brand: "",
    model: "",
    quantity: 0,
  });
}
function removeCaseFan(index: number) {
  specification.value.case_fan.splice(index, 1);
}
function addGallery() {
  galleries.value.push({
    thumbnail: false,
    src: "",
  });
}
function removeGallery(index: number) {
  galleries.value.splice(index, 1);
}

function saveBuild() {
  $fetch("/api/build/single", {
    method: "POST",
    body: {
      code: code.value,
      owner: owner.value,
      name: name.value,
      benchmark: benchmark.value,
      price_value: price_value.value,
      team: team.value,
      specification: specification.value,
      gallery: galleries.value,
    },
  });
}
function saveComponentCSV(event: any) {
  // console.log(event);
  // $fetch("/api/component", {
  //   method: "POST",
    
  // })
  toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000})
}
onMounted(async () => {
  isLoaded.value = true;
});
</script>

<template>
  <div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">Single Form</Tab>
        <Tab value="1">Import Product CSV</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="w-full bg-[#202020] flex flex-col">
            <div class="p-8 border border-[#3F3F3F]">
              <p class="mb-8 font-kanit text-3xl text-[#FA1D33]">Build</p>
              <div class="grid grid-cols-3 gap-8">
                <div>
                  <p class="font-kanit text-[#5c5c5c]">Kode</p>
                  <DividerSmall />
                  <InputText class="w-full" v-model="code" />
                </div>
                <div>
                  <p class="font-kanit text-[#5c5c5c]">Pemilik</p>
                  <DividerSmall />
                  <InputText class="w-full" v-model="owner" />
                </div>
                <div>
                  <p class="font-kanit text-[#5c5c5c]">Nama</p>
                  <DividerSmall />
                  <InputText class="w-full" v-model="name" />
                </div>
                <div>
                  <p class="font-kanit text-[#5c5c5c]">Benchmark</p>
                  <DividerSmall />
                  <InputText class="w-full" v-model="benchmark" />
                </div>
                <div>
                  <p class="font-kanit text-[#5c5c5c]">Harga</p>
                  <DividerSmall />
                  <InputNumber class="w-full" v-model="price_value" />
                </div>
              </div>
            </div>
            <div class="p-8 border border-[#3F3F3F]">
              <p class="my-8 font-kanit text-3xl text-[#FA1D33]">Tim</p>
              <div class="flex gap-8">
                <div class="w-full">
                  <p class="font-kanit text-[#5c5c5c]">CPU</p>
                  <DividerSmall />
                  <Select
                    class="w-full"
                    :options="teamOptions"
                    optionLabel="label"
                    optionValue="value"
                    v-model="team.cpu"
                  />
                </div>
                <div class="w-full">
                  <p class="font-kanit text-[#5c5c5c]">GPU</p>
                  <DividerSmall />
                  <Select
                    class="w-full"
                    :options="teamOptions"
                    optionLabel="label"
                    optionValue="value"
                    v-model="team.gpu"
                  />
                </div>
              </div>
            </div>
            <div class="p-8 border border-[#3F3F3F]">
              <p class="my-8 font-kanit text-3xl text-[#FA1D33]">Spesifikasi</p>
              <div class="flex flex-col gap-8">
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">CPU</p>
                  <div class="flex gap-8">
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Brand</p>
                      <DividerSmall />
                      <Select
                        class="w-full"
                        :options="cpuBrandOptions"
                        optionLabel="label"
                        optionValue="value"
                        v-model="specification.cpu.brand"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Model</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.cpu.model"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Socket</p>
                      <DividerSmall />
                      <Select
                        class="w-full"
                        :options="cpuSocketOptions"
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                        optionLabel="label"
                        optionValue="value"
                        v-model="specification.cpu.socket"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Base Frequency</p>
                      <DividerSmall />
                      <InputNumber
                        class="w-full"
                        :minFractionDigits="2"
                        v-model="specification.cpu.base_frequency"
                      />
                    </div>
                  </div>
                </div>
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">GPU</p>
                  <div class="flex gap-8">
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Brand</p>
                      <DividerSmall />
                      <Select
                        class="w-full"
                        :options="gpuBrandOptions"
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                        optionLabel="label"
                        optionValue="value"
                        v-model="specification.gpu.brand"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Manufacturer</p>
                      <DividerSmall />
                      <Select
                        class="w-full"
                        :options="gpuManufacturerOptions"
                        optionLabel="label"
                        optionValue="value"
                        v-model="specification.gpu.manufacturer"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Model</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.gpu.model"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">VRAM</p>
                      <DividerSmall />
                      <InputNumber
                        class="w-full"
                        v-model="specification.gpu.memory"
                      />
                    </div>
                  </div>
                </div>
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">
                    Motherboard
                  </p>
                  <div class="flex gap-8">
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Brand</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.motherboard.brand"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Model</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.motherboard.model"
                      />
                    </div>
                  </div>
                </div>
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">RAM</p>
                  <div class="flex flex-col gap-8">
                    <div
                      class="w-full p-8 flex items-between border border-[#3F3F3F] gap-8"
                      v-for="ram in specification.ram"
                    >
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Brand</p>
                        <DividerSmall />
                        <InputText class="w-full" v-model="ram.brand" />
                      </div>
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Model</p>
                        <DividerSmall />
                        <InputText class="w-full" v-model="ram.model" />
                      </div>
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Size</p>
                        <DividerSmall />
                        <InputNumber class="w-full" v-model="ram.size" />
                      </div>
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Quantity</p>
                        <DividerSmall />
                        <InputNumber class="w-full" v-model="ram.quantity" />
                      </div>
                      <div>
                        <Button
                          @click="removeRam(specification.ram.indexOf(ram))"
                          icon=""
                          severity="danger"
                        >
                          <template #icon>
                            <Icon
                              class=""
                              name="uil:trash"
                              style="color: black"
                            />
                          </template>
                        </Button>
                      </div>
                    </div>
                    <Button @click="addRam()" icon="">
                      <template #icon>
                        <Icon class="" name="uil:plus" style="color: black" />
                      </template>
                    </Button>
                  </div>
                </div>
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">Storage</p>
                  <div class="flex flex-col gap-8">
                    <div
                      class="w-full p-8 flex items-between border border-[#3F3F3F] gap-8"
                      v-for="storage in specification.storage"
                    >
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Brand</p>
                        <DividerSmall />
                        <InputText class="w-full" v-model="storage.brand" />
                      </div>
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Model</p>
                        <DividerSmall />
                        <InputText class="w-full" v-model="storage.model" />
                      </div>
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Capacity</p>
                        <DividerSmall />
                        <InputNumber
                          class="w-full"
                          v-model="storage.capacity"
                        />
                      </div>
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Quantity</p>
                        <DividerSmall />
                        <InputNumber
                          class="w-full"
                          v-model="storage.quantity"
                        />
                      </div>
                      <div>
                        <Button
                          @click="
                            removeStorage(
                              specification.storage.indexOf(storage)
                            )
                          "
                          icon=""
                          severity="danger"
                        >
                          <template #icon>
                            <Icon
                              class=""
                              name="uil:trash"
                              style="color: black"
                            />
                          </template>
                        </Button>
                      </div>
                    </div>
                    <Button @click="addStorage()" icon="">
                      <template #icon>
                        <Icon class="" name="uil:plus" style="color: black" />
                      </template>
                    </Button>
                  </div>
                </div>
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">PSU</p>
                  <div class="flex gap-8">
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Brand</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.power_supply.brand"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Model</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.power_supply.model"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Wattage</p>
                      <DividerSmall />
                      <InputNumber
                        class="w-full"
                        v-model="specification.power_supply.wattage"
                      />
                    </div>
                  </div>
                </div>
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">
                    CPU Cooler
                  </p>
                  <div class="flex gap-8">
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Brand</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.cpu_cooler.brand"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Model</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.cpu_cooler.model"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Type</p>
                      <DividerSmall />
                      <Select
                        class="w-full"
                        :options="cpuCoolerTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        v-model="specification.cpu_cooler.type"
                      />
                    </div>
                  </div>
                </div>
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">
                    Case Fan
                  </p>
                  <div class="flex flex-col gap-8">
                    <div
                      class="w-full p-8 flex items-between border border-[#3F3F3F] gap-8"
                      v-for="fan in specification.case_fan"
                    >
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Brand</p>
                        <DividerSmall />
                        <InputText class="w-full" v-model="fan.brand" />
                      </div>
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Model</p>
                        <DividerSmall />
                        <InputText class="w-full" v-model="fan.model" />
                      </div>
                      <div class="w-full">
                        <p class="font-kanit text-[#5c5c5c]">Quantity</p>
                        <DividerSmall />
                        <InputNumber class="w-full" v-model="fan.quantity" />
                      </div>
                      <div>
                        <Button
                          @click="
                            removeCaseFan(specification.case_fan.indexOf(fan))
                          "
                          icon=""
                          severity="danger"
                        >
                          <template #icon>
                            <Icon
                              class=""
                              name="uil:trash"
                              style="color: black"
                            />
                          </template>
                        </Button>
                      </div>
                    </div>
                    <Button @click="addCaseFan()" icon="">
                      <template #icon>
                        <Icon class="" name="uil:plus" style="color: black" />
                      </template>
                    </Button>
                  </div>
                </div>
                <div class="p-8 border border-[#3F3F3F]">
                  <p class="my-8 font-kanit text-3xl text-[#FA1D33]">Case</p>
                  <div class="flex gap-8">
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Brand</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.case.brand"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Model</p>
                      <DividerSmall />
                      <InputText
                        class="w-full"
                        v-model="specification.case.model"
                      />
                    </div>
                    <div class="w-full">
                      <p class="font-kanit text-[#5c5c5c]">Form Factor</p>
                      <DividerSmall />
                      <Select
                        class="w-full"
                        :options="motherboardFormFactorOptions"
                        optionLabel="label"
                        optionValue="value"
                        v-model="specification.case.form_factor"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-8 border border-[#3F3F3F]">
              <p class="my-8 font-kanit text-3xl text-[#FA1D33]">Gallery</p>
              <div class="flex flex-col gap-8">
                <div
                  class="w-full p-8 flex items-between border border-[#3F3F3F] gap-8"
                  v-for="gallery in galleries"
                >
                  <div>
                    <p class="font-kanit text-[#5c5c5c]">Thumbnail</p>
                    <DividerSmall />
                    <ToggleSwitch v-model="gallery.thumbnail" />
                  </div>
                  <div class="w-full">
                    <p class="font-kanit text-[#5c5c5c]">Source Path</p>
                    <DividerSmall />
                    <InputText class="w-full" v-model="gallery.src" />
                  </div>
                  <div>
                    <Button
                      @click="removeGallery(galleries.indexOf(gallery))"
                      icon=""
                      severity="danger"
                    >
                      <template #icon>
                        <Icon class="" name="uil:trash" style="color: black" />
                      </template>
                    </Button>
                  </div>
                </div>
                <Button @click="addGallery()" icon="">
                  <template #icon>
                    <Icon class="" name="uil:plus" style="color: black" />
                  </template>
                </Button>
              </div>
            </div>
            <div class="py-8">
              <Button class="w-full" @click="saveBuild()" label="Submit" />
            </div>
          </div>
        </TabPanel>
        <TabPanel value="1">
          <div class="flex flex-col gap-8">
            <FileUpload accept=".csv" class="w-full" :maxFileSize="1000000" mode="basic" name="demo[]" ref="fileComponentCSV" @upload="saveComponentCSV" url="api/component" />
            <Button class="w-full" @click="fileComponentCSV.upload()" label="Upload" severity="secondary" />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
