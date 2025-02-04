<script lang="ts" setup>
const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <div id="footer">
    <div class="w-full flex border-t border-[#2C2C2C] bg-[#121212]">
      <div class="py-16 pl-16 basis-1/2 border-r border-[#2C2C2C]">
        <p class="font-tomorrow font-bold text-[#FA1D33]">HEAVY_STATION</p>
        <div class="my-8 border-b border-[#2C2C2C]"></div>
        <p class="font-kanit text-[#AFAFAF]">Bukit Menganti Regency C-10</p>
        <p class="font-kanit text-[#AFAFAF]">
          Domas, Menganti, Gresik, Jawa Timur, Indonesia, 61174
        </p>
      </div>
      <div class="pr-16 flex basis-1/2 items-center justify-center">
        <p class="font-kanit text-[#AFAFAF]">
          Copyright © 2024 — {{ currentYear }} Noktah Inovasi Teknologi.
        </p>
      </div>
    </div>
  </div>
</template>
