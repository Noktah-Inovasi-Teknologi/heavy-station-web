<script setup lang="ts">
let catalogue = ref<Record<string, any>>({});
let builds = ref<Record<string, any>[]>([]);
let buildsTotal = ref(0);
let page = ref(1);
let pageSize = ref(6);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
async function fetchBuildsTotal() {
  buildsTotal.value = await $fetch("/api/read-builds-total", {
    method: "GET",
  })
}
async function fetchBuilds() {
  builds.value = await $fetch("/api/read-builds", {
    method: "GET",
    params: {
      page: page.value,
      page_size: pageSize.value,
    },
  });
  builds.value.forEach((build: any) => {
    build.team = JSON.parse(build.team);
    build.galleries = JSON.parse(build.galleries);
  });
}
async function fetchNewPage(pageValue: number) {
  page.value = pageValue + 1;
  await fetchBuilds();
}

onMounted(async () => {
  await fetchBuildsTotal();
  await fetchBuilds();
  console.log(catalogue.value);
});
</script>

<template>
  <Header />
  <div class="p-16 bg-[#202020]" id="content">
    <div class="w-full bg-[#202020] grid grid-cols-2">
      <div
        class="flex justify-between items-center border border-[#3F3F3F]"
        v-for="item in builds"
      >
        <img
          v-if="item.galleries && item.galleries.length > 0"
          :src="item.galleries.find((g: any) => g.thumbnail)?.src || '/img/no-image.png'"
          :alt="item.name"
          class="h-[36rem] aspect-square"
        />
        <div
          class="pr-16 flex flex-col gap-8 font-kanit font-light text-[#838383]"
        >
          <div>
            <p>Nama</p>
            <div class="my-2 border-b border-[#3F3F3F]"></div>
            <p class="font-kanit text-3xl text-[#FA1D33]">{{ item.name }}</p>
          </div>
          <div>
            <p>Kode</p>
            <div class="my-2 border-b border-[#3F3F3F]"></div>
            <p class="font-kanit text-3xl text-[#FA1D33]">{{ item.code }}</p>
          </div>
          <div>
            <p>Benchmark</p>
            <div class="my-2 border-b border-[#3F3F3F]"></div>
            <p class="font-kanit text-3xl text-[#FA1D33]">
              {{ item.benchmark }}
            </p>
          </div>
          <div>
            <p>Harga</p>
            <div class="my-2 border-b border-[#3F3F3F]"></div>
            <p class="font-kanit text-3xl text-[#FA1D33]">
              {{ formatPrice(item.price_value) }}
            </p>
          </div>
          <div>
            <Button class="w-full">
              <div class="flex items-center font-kanit">
                <Icon
                  class="w-6 h-6 mr-4"
                  name="uil:arrow-up-right"
                  style="color: black"
                />
                <NuxtLink class="font-medium" :to="`/build/${item.id}`"
                  >Lihat lebih lanjut</NuxtLink
                >
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <Paginator @page="fetchNewPage($event.page)" :rows="pageSize" :totalRecords="buildsTotal"></Paginator>
  </div>
  <Footer />
</template>
