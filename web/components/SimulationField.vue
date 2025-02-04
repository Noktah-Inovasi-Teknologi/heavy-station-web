<script lang="ts" setup>
let props = defineProps(["label", "item", "list", "itemList"]);
let emits = defineEmits([
  "update:item",
  "update:itemList",
  "focus",
]);
let item = ref(props.item);
let itemList = ref(props.itemList);

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(price);
}
function addItem() {
  itemList.value.push({
    component: "",
    quantity: 0,
    price: 0,
    first: 0,
  });
}
function removeItem(index: number) {
  itemList.value.splice(index, 1);
}
function emitUpdatedItem(key: string, event: any) {
  item.value[key] = event;
  emits("update:item", item.value);
}
function emitUpdatedList() {
  console.log(itemList.value);
  emits("update:itemList", itemList.value);
}
</script>

<template>
  <div>
    <div class="w-full flex items-stretch">
      <p
        class="basis-3/12 p-8 border-x border-b border-[#3F3F3F] flex items-center font-kanit text-[#FA1D33] text-3xl"
      >
        {{ props.label }}
      </p>
      <div class="w-full flex" v-if="!props.list">
        <div class="p-8 border-b border-[#3F3F3F] basis-6/12">
          <InputText
            @focus="emits('focus', props.label.toLowerCase())"
            class="w-full"
            :placeholder="`Pilih ${props.label} ...`"
            @update:modelValue="emitUpdatedItem('component', $event)"
            :modelValue="item.component"
          />
        </div>
        <div class="p-8 border-x border-b border-[#3F3F3F] basis-3/12">
          <InputNumber
            buttonLayout="horizontal"
            fluid
            showButtons
            :step="1"
            @update:modelValue="emitUpdatedItem('quantity', $event)"
            v-model="item.quantity"
          >
            <template #decrementicon>
              <Icon name="uil:minus" class="text-2xl" />
            </template>
            <template #incrementicon>
              <Icon name="uil:plus" class="text-2xl" />
            </template>
          </InputNumber>
        </div>
        <div
          class="p-8 border-b border-r border-[#3F3F3F] basis-3/12 flex items-center justify-between font-kanit text-[#FA1D33] text-2xl"
        >
          <p>Rp</p>
          <p>{{ formatPrice(item.price * item.quantity) }}</p>
        </div>
      </div>
      <div class="w-full flex" v-else>
        <div class="w-full border-[#3F3F3F]">
          <div class="flex" v-for="(item, index) in itemList" :key="index">
            <div class="flex basis-6/12">
              <div class="pl-8 flex items-center justify-center">
                <Button icon="" @click="removeItem(index)" severity="danger">
                  <template #icon>
                    <Icon class="" name="uil:trash" style="color: white" />
                  </template>
                </Button>
              </div>
              <div class="w-full p-8 border-[#3F3F3F]">
                <InputText
                  class="w-full"
                  @focus="emits('focus', String(index))"
                  :placeholder="`Pilih ${props.label} ...`"
                  v-model="item.component"
                  @input="emitUpdatedList"
                />
              </div>
            </div>
            <div class="p-8 border-[#3F3F3F] basis-3/12 border-x">
              <InputNumber
                buttonLayout="horizontal"
                fluid
                id="cpu"
                @input="emitUpdatedList"
                showButtons
                :step="1"
                v-model="item.quantity"
              >
                <template #decrementicon>
                  <Icon name="uil:minus" class="text-2xl" />
                </template>
                <template #incrementicon>
                  <Icon name="uil:plus" class="text-2xl" />
                </template>
              </InputNumber>
            </div>
            <div
              class="p-8 border-r border-[#3F3F3F] basis-3/12 flex items-center justify-between font-kanit text-[#FA1D33] text-2xl"
            >
              <p>Rp</p>
              <p>{{ formatPrice(item.price) }}</p>
            </div>
          </div>
          <div class="p-8 border-r border-y border-[#3F3F3F]">
            <Button icon="" @click="addItem()">
              <template #icon>
                <Icon class="" name="uil:plus" style="color: black" />
              </template>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
