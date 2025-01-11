<script lang="ts" setup>
const currentYear = ref(new Date().getFullYear());
</script>

<template>
  <div id="footer">
    <div class="w-full flex border-t border-[#3F3F3F] bg-[#202020]">
      <div class="py-16 pl-16 basis-1/2 border-r border-[#3F3F3F]">
        <p class="font-tomorrow font-bold text-[#FA1D33]">HEAVY_STATION</p>
        <div class="my-8 border-b border-[#3F3F3F]"></div>
        <p class="font-kanit text-[#3F3F3F]">Bukit Menganti Regency C-10</p>
        <p class="font-kanit text-[#3F3F3F]">
          Domas, Menganti, Gresik, Jawa Timur, Indonesia, 61174
        </p>
      </div>
      <div class="pr-16 flex basis-1/2 items-center justify-center">
        <p class="font-kanit text-[#3F3F3F]">
          Copyright © 2024 — {{ currentYear }} Noktah Inovasi Teknologi.
        </p>
      </div>
    </div>
  </div>
</template>
