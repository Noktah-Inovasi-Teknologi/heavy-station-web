<script lang="ts" setup>
import { cloneDeep, random } from "lodash";

interface ComponentItem {
  id: number | undefined;
  component: string;
  quantity: number;
  price: number;
  first: number;
}
interface Components {
  [key: string]: ComponentItem | ComponentItem[];
  motherboard: ComponentItem;
  cpu: ComponentItem;
  gpu: ComponentItem;
  ram: ComponentItem[];
  storage: ComponentItem[];
  psu: ComponentItem;
  cpu_cooler: ComponentItem;
  case: ComponentItem;
  monitor: ComponentItem[];
  keyboard: ComponentItem;
  mouse: ComponentItem;
  case_fan: ComponentItem[];
}

const defaultComponentItem: ComponentItem = {
  id: undefined,
  component: "",
  quantity: 0,
  price: 0,
  first: 0,
};
let activeInput = ref("");
let activeInputIndex = ref<number | undefined>(undefined);
let optionsValue = ref<Record<string, any>>({
  motherboard: [],
  cpu: [],
  gpu: [],
  ram: [[]],
  storage: [[]],
  psu: [],
  cpu_cooler: [],
  case: [],
});
let value = ref<Components>({
  motherboard: { ...defaultComponentItem },
  cpu: { ...defaultComponentItem },
  gpu: { ...defaultComponentItem },
  ram: [],
  storage: [],
  psu: { ...defaultComponentItem },
  cpu_cooler: { ...defaultComponentItem },
  case: { ...defaultComponentItem },
  monitor: [],
  keyboard: { ...defaultComponentItem },
  mouse: { ...defaultComponentItem },
  case_fan: [],
  headset: { ...defaultComponentItem },
  speaker: { ...defaultComponentItem },
  microphone: { ...defaultComponentItem },
  gpu_bracket: { ...defaultComponentItem },
  wifi_adapter: { ...defaultComponentItem },
  sound_adapter: { ...defaultComponentItem },
  bluetooth_adapter: { ...defaultComponentItem },
  mouse_pad: { ...defaultComponentItem },
  pcie_adapter: { ...defaultComponentItem },
});
let componentValues = computed(() =>
  Object.fromEntries(
    Object.entries(cloneDeep(value.value)).map(([key, obj]) => [
      key,
      Array.isArray(obj)
        ? obj.map((item) => item.component) // Handle arrays
        : obj, // Handle objects
    ])
  )
);

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(price);
}
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = "/images/no-image.png";
}
function setActiveInput(id: string, index: number | undefined = undefined) {
  activeInput.value = id;
  if (index !== undefined) {
    activeInputIndex.value = index;
  } else {
    activeInputIndex.value = undefined;
  }
  // console.log("Active Input", id);
}
function getTotalRecords() {
  if (optionsValue.value[activeInput.value]) {
    if (activeInputIndex.value) {
      return (optionsValue.value as any)[activeInput.value][
        activeInputIndex.value
      ].length;
    } else {
      return (optionsValue.value as any)[activeInput.value].length;
    }
  } else {
    return 0;
  }
}
function getFirst() {
  if (value.value[activeInput.value]) {
    if (activeInputIndex.value) {
      return (value.value as any)[activeInput.value][activeInputIndex.value]
        .first;
    } else {
      return (value.value as any)[activeInput.value].first;
    }
  } else {
    return 0;
  }
}
function changeFirst(num: number) {
  if (value.value[activeInput.value]) {
    if (activeInputIndex.value) {
      (value.value as any)[activeInput.value][activeInputIndex.value].first =
        num;
    } else {
      (value.value as any)[activeInput.value].first = num;
    }
  }
}
function paginatedItems() {
  const ITEMS_PER_PAGE = 10;
  const activeComponent = value.value[activeInput.value];
  const activeOptions = optionsValue.value[activeInput.value];

  if (!activeComponent || !activeOptions) return [];

  const first =
    activeInputIndex.value !== undefined
      ? (activeComponent as ComponentItem[])[activeInputIndex.value]?.first || 0
      : (activeComponent as ComponentItem).first || 0;

  const items =
    activeInputIndex.value !== undefined
      ? activeOptions[activeInputIndex.value]
      : activeOptions;

  return items?.slice(first, first + ITEMS_PER_PAGE) || [];
}
function addItem(item: any) {
  const targetKey = activeInput.value;
  const isList = activeInputIndex.value !== undefined;

  const target: ComponentItem = isList
    ? (value.value[targetKey] as ComponentItem[])[activeInputIndex.value!]
    : (value.value[targetKey] as ComponentItem);
  Object.assign(target, {
    id: item.id,
    component: item.name,
    quantity: 1,
    price: random(15000000),
  });

  // Reset inputs
  activeInput.value = "";
  if (isList) {
    activeInputIndex.value = undefined;
  }
}
async function fetchOptions(value: string, cat1: string, index?: number) {
  let val: any = await $fetch("/api/component", {
    method: "GET",
    params: {
      name: value,
      cat1: cat1,
    },
  });
  if (index !== undefined) {
    optionsValue.value[cat1][index] = val;
  } else {
    optionsValue.value[cat1] = val;
  }
}

watch(
  componentValues,
  (newVal, oldVal) => {
    Object.entries(newVal).forEach(([key, newComponent]) => {
      let oldComponent = oldVal[key];
      if (Array.isArray(newComponent) && Array.isArray(oldComponent)) {
        newComponent.forEach((comp, index) => {
          if (!isEqual(comp, oldComponent[index])) {
            fetchOptions(comp, key, index);
          }
        });
      } else if (!isEqual(newComponent, oldComponent)) {
        fetchOptions((newComponent as Record<string, any>).component, key);
      }
    });
  },
  { deep: true }
);
onMounted(async () => {});
</script>

<template>
  <Header />
  <div class="p-16 bg-[#121212]" id="content">
    <div class="w-full flex gap-16 bg-[#121212]">
      <div class="basis-2/3 flex flex-col gap-16">
        <div>
          <p class="mb-8 font-kanit text-[#FA1D33] text-5xl">Utama</p>
          <SimulationField
            class="border-t border-[#2C2C2C]"
            @focus="setActiveInput('motherboard')"
            :item="value.motherboard"
            label="Motherboard"
            @update:item="value.motherboard = $event"
          />
          <SimulationField
            @focus="setActiveInput('cpu')"
            :item="value.cpu"
            label="CPU"
            @update:item="value.cpu = $event"
          />
          <SimulationField
            @focus="setActiveInput('gpu')"
            :item="value.gpu"
            label="GPU"
            @update:item="value.gpu = $event"
          />
          <SimulationField
            @focus="(index) => setActiveInput('ram', index)"
            label="RAM"
            :list="true"
            :itemList="value.ram"
            @update:item-list="value.ram = $event"
          />
          <SimulationField
            @focus="(index) => setActiveInput('ssd', index)"
            label="SSD"
            :list="true"
            :itemList="value.ssd"
            @update:item-list="value.ssd = $event"
          />
          <SimulationField
            @focus="setActiveInput('psu')"
            :item="value.psu"
            label="PSU"
            @update:item="value.psu = $event"
          />
          <SimulationField
            @focus="setActiveInput('cpu_cooler')"
            :item="value.cpu_cooler"
            label="CPU Cooler"
            @update:item="value.cpu_cooler = $event"
          />
          <SimulationField
            @focus="setActiveInput('case')"
            :item="value.case"
            label="Case"
            @update:item="value.case = $event"
          />
        </div>
        <!-- <div>
          <p class="mb-8 font-kanit text-[#FA1D33] text-5xl">Pelengkap</p>
          <SimulationField
            class="border-t border-[#2C2C2C]"
            label="Monitor"
            value=""
            quantity=""
            price="1000000"
            :list="true"
          />
          <SimulationField
            label="Keyboard"
            value=""
            quantity=""
            price="1000000"
          />
          <SimulationField label="Mouse" value="" quantity="" price="1000000" />
          <SimulationField
            label="Case Fan"
            value=""
            quantity=""
            price="1000000"
            :list="true"
          />
          <SimulationField
            label="Headset"
            value=""
            quantity=""
            price="1000000"
          />
          <SimulationField
            label="Speaker"
            value=""
            quantity=""
            price="1000000"
          />
          <SimulationField
            label="Microphone"
            value=""
            quantity=""
            price="1000000"
          />
        </div>
        <div>
          <p class="mb-8 font-kanit text-[#FA1D33] text-5xl">Utilitas</p>
          <SimulationField
            class="border-t border-[#2C2C2C]"
            label="GPU Bracket"
            value=""
            quantity=""
            price="1000000"
          />
          <SimulationField
            label="Wi-Fi Adapter"
            value=""
            quantity=""
            price="1000000"
          />
          <SimulationField
            class="border-t border-[#2C2C2C]"
            label="Sound Adapter"
            value=""
            quantity=""
            price="1000000"
          />
          <SimulationField
            class="border-t border-[#2C2C2C]"
            label="Bluetooth Adapter"
            value=""
            quantity=""
            price="1000000"
          />
        </div>
        <div>
          <p class="mb-8 font-kanit text-[#FA1D33] text-5xl">Aksesoris</p>
          <SimulationField
            class="border-t border-[#2C2C2C]"
            label="Mouse Pad / Desk Mat"
            value=""
            quantity=""
            price="1000000"
          />
          <SimulationField
            class="border-t border-[#2C2C2C]"
            label="PCIe Adapter"
            value=""
            quantity=""
            price="1000000"
          />
        </div> -->
      </div>
      <div class="basis-1/3 p-8 border border-[#2C2C2C]">
        <Paginator
          class="mb-8"
          :first="getFirst()"
          :rows="10"
          :totalRecords="getTotalRecords()"
          @update:first="changeFirst($event)"
        />
        <div class="grid grid-cols-2 gap-8">
          <div
            class="relative hover:cursor-pointer group"
            @click="addItem(item)"
            v-if="Array.isArray(optionsValue[activeInput])"
            v-for="item in paginatedItems()"
          >
            <div
              class="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity"
            />
            <img
              class="aspect-square relative z-10"
              @error="handleImageError"
              :src="`/images/components/${activeInput}/${item.slug}/0.png`"
            />
            <p
              class="m-2 font-hostgrotesk text-[#AFAFAF] overflow-hidden text-ellipsis break-words relative z-10"
              style="
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
              "
            >
              {{ item.name }}
            </p>
            <p class="m-2 font-hostgrotesk text-[#FA1D33] text-xl">
              Rp {{ formatPrice(random(15000000)) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
