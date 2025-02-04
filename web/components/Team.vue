<script lang="ts" setup>
const props = defineProps(["size", "cpu", "gpu"]);

const normalizedCpu = props.cpu.toLowerCase();
const normalizedGpu = props.gpu.toLowerCase();
</script>

<template>
  <div class="mb-2 flex items-center text-white text-lg">
  <p class="w-full">{{ props.cpu.toUpperCase() }}</p>
  <p class="w-full text-end" v-if="normalizedCpu !== normalizedGpu">{{ props.gpu.toUpperCase() }}</p>
  </div>
  <div
    :class="[
      'flex items-center justify-between font-kanit font-semibold text-white',
      {
        'p-16 text-7xl': size === 'xl',
        'p-8 text-5xl': size === 'lg',
        'p-4 text-3xl': size === 'md',
        'p-1 text-2xl': size === 'sm',
      },
      {
        'bg-gradient-to-r': normalizedCpu !== normalizedGpu,
      },
      {
        'from-[#FF2424]': normalizedCpu !== normalizedGpu && normalizedCpu === 'amd',
        'from-[#76B900]': normalizedCpu !== normalizedGpu && normalizedCpu === 'nvidia',
        'from-[#0068B5]': normalizedCpu !== normalizedGpu && normalizedCpu === 'intel',
      },
      {
        'to-[#FF2424]': normalizedCpu !== normalizedGpu && normalizedGpu === 'amd',
        'to-[#76B900]': normalizedCpu !== normalizedGpu && normalizedGpu === 'nvidia',
        'to-[#0068B5]': normalizedCpu !== normalizedGpu && normalizedGpu === 'intel',
      },
      {
        'from-30% to-50%': normalizedCpu === 'amd' && normalizedGpu === 'nvidia',
        'from-35% to-55%': normalizedCpu === 'intel' && normalizedGpu === 'nvidia',
        'from-40% to-60%':
          (normalizedCpu === 'amd' && normalizedGpu === 'intel') ||
          (normalizedCpu === 'intel' && normalizedGpu === 'amd'),
      },
      {
        'bg-[#FF2424]': normalizedCpu === normalizedGpu && normalizedCpu === 'amd',
        'bg-[#76B900]': normalizedCpu === normalizedGpu && normalizedCpu === 'nvidia',
        'bg-[#0068B5]': normalizedCpu === normalizedGpu && normalizedCpu === 'intel',
      },
      {
        'text-center': normalizedCpu === normalizedGpu,
      }
    ]"
  >
    
  </div>
</template>
