<script lang="ts" setup>
defineProps(["label", "value", "border"]);
</script>

<template>
  <div
    :class="[
      'py-4 px-8',
      {
        'border-l border-[#3F3F3F]': border?.l,
        'border-r border-[#3F3F3F]': border?.r,
        'border-t border-[#3F3F3F]': border?.t,
        'border-b border-[#3F3F3F]': border?.b,
      },
    ]"
  >
    <p class="font-kanit text-[#838383]">{{ label }}</p>
    <div class="my-2 border-b border-[#3F3F3F]" />
    <p class="font-kanit text-3xl text-[#FA1D33]">{{ value }}</p>
  </div>
</template>
