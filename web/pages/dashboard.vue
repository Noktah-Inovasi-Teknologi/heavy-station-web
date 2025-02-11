<script lang="ts" setup>
import { hasPermissions } from "../utils/common";

definePageMeta({
  middleware: ["auth-logged-in"]
})

let hasAdminPermission = ref<Boolean | undefined>(undefined)
let isLoaded = ref(false);
let contentPage = ref(0);
let { value } = await hasPermissions(["dashboard"]);



watch(hasAdminPermission, (newVal, oldVal) => {
  if (oldVal === undefined && typeof newVal === "boolean") {
    console.log(oldVal, newVal);
    if (!hasAdminPermission.value) {
      console.log("403")
      // navigateTo("/403");
    } else {
      isLoaded.value = true;
    }
  }
})

onMounted(async () => {
  hasAdminPermission.value = value;
});
</script>

<template>
  <Header />
  <div class="p-16 bg-[#121212] flex gap-8" id="content" v-if="isLoaded">
    <div class="flex flex-col border border-[#2C2C2C]" id="sidebar">
      <div class="p-8 hover:bg-[#414141] hover:cursor-pointer font-kanit text-[#FA1D33] text-xl" @click="contentPage = 0">Import Data</div>
      <div class="p-8 hover:bg-[#414141] hover:cursor-pointer font-kanit text-[#FA1D33] text-xl" @click="contentPage = 1">Data</div>
    </div>
    <div class="w-full p-8 flex flex-col gap-8 border border-[#2C2C2C]" id="content">
      <DataImporter v-if="contentPage == 0" />
      <DataViewer class="w-full" v-if="contentPage == 1" />
    </div>
  </div>
  <Toast />
</template>
