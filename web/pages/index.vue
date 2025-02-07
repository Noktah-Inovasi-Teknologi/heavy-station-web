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
function budgetType(priceVal: number) {
  if (priceVal <= 6000000) {
    return "Entry Level";
  } else if (priceVal > 6000000 && priceVal <= 8500000) {
    return "Lower End";
  } else if (priceVal > 8500000 && priceVal <= 12500000) {
    return "Budget";
  } else if (priceVal > 13000000 && priceVal <= 18000000) {
    return "Mid Range";
  } else if (priceVal > 18000000 && priceVal <= 35000000) {
    return "High End";
  } else if (priceVal > 35000000 && priceVal <= 60000000) {
    return "Enthusiast";
  } else if (priceVal > 60000000) {
    return "Extreme";
  }
}
async function fetchBuildsTotal() {
  buildsTotal.value = await $fetch("/api/read-builds-total", {
    method: "GET",
  });
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
  // await fetchBuildsTotal();
  // await fetchBuilds();
  console.log(catalogue.value);
});
</script>

<template>
  <Header />
  <div class="p-16 bg-[#121212]" id="content">
    <div class="w-full bg-[#121212] grid grid-cols-3">
      <div class="flex flex-col border border-[#2C2C2C]" v-for="item in builds">
        <div class="w-full p-12 flex justify-between items-center">
          <div class="flex flex-col">
            <img
              v-if="item.galleries && item.galleries.length > 0"
              :src="item.galleries.find((g: any) => g.thumbnail)?.src || '/img/no-image.png'"
              :alt="item.name"
              class="h-[18rem] aspect-square"
            />
            <div class="h-[1rem] bg-"></div>
            <Team
              class=""
              size="sm"
              :cpu="item.team.cpu"
              :gpu="item.team.gpu"
            />
          </div>
          <div
            class="h-full flex flex-col justify-between font-hostgrotesk text-[#AFAFAF]"
          >
            <div class="flex flex-col gap-2">
              <div>
                <p>Nama</p>
                <div class="my-1 border-b border-[#2C2C2C]"></div>
                <p class="font-hostgrotesk font-semibold text-xl text-[#FA1D33]">
                  {{ item.name }}
                </p>
              </div>
              <div>
                <p>Kode</p>
                <div class="my-1 border-b border-[#2C2C2C]"></div>
                <p class="font-hostgrotesk font-semibold text-xl text-[#FA1D33]">
                  {{ item.code }}
                </p>
              </div>
              <div>
                <p>Benchmark</p>
                <div class="my-1 border-b border-[#2C2C2C]"></div>
                <p class="font-hostgrotesk font-semibold text-xl text-[#FA1D33]">
                  {{ item.benchmark }}
                </p>
              </div>
              <!-- <div>
                <p>Jenis</p>
                <div class="my-1 border-b border-[#2C2C2C]" />
                <p class="font-hostgrotesk text-xl text-[#FA1D33]">
                  {{ budgetType(item.price_value) }}
                </p>
              </div> -->
              <div>
                <p>Harga</p>
                <div class="my-1 border-b border-[#2C2C2C]" />
                <p class="font-hostgrotesk font-semibold text-xl text-[#FA1D33]">
                  {{ formatPrice(item.price_value) }}
                </p>
              </div>
            </div>
            <div>
              <Button class="w-full border-[#F1F1F1]" size="small" outlined>
                <NuxtLink
                  class="w-full flex items-center font-hostgrotesk font-medium"
                  :to="`/build/${item.id}`"
                >
                  <Icon
                    class="w-6 h-6 mr-4"
                    name="uil:arrow-up-right"
                    style="color: black"
                  />
                  <p>Lihat lebih lanjut</p>
                </NuxtLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Paginator
      @page="fetchNewPage($event.page)"
      :rows="pageSize"
      :totalRecords="buildsTotal"
    ></Paginator>
  </div>
  <Footer />
</template>
