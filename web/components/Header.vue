<script lang="ts" setup>
interface MenuItem {
  label: string;
  to: string;
  admin: boolean;
}

let route = useRoute();
let menu = ref<MenuItem[]>([
  {
    label: "Katalog",
    to: "/",
    admin: false,
  },
  {
    label: "Simulasi Rakit PC",
    to: "/simulasi-rakit-pc",
    admin: false,
  },
  {
    label: "Dasbor",
    to: "/dashboard",
    admin: true,
  },
]);

const { loggedIn, user, session, fetch, clear } = useUserSession();

async function logout() {
  await clear();
  window.location.reload();
}
</script>

<template>
  <div id="header">
    <div class="w-full flex justify-between bg-[#121212]">
      <NuxtLink
        class="basis-3/4 py-8 px-16 border-b border-[#2C2C2C] font-tomorrow font-bold text-[#FA1D33] text-2xl"
        to="/"
      >
        HEAVY_STATION
      </NuxtLink>
      <div class="flex">
        <template :key="item.label" v-for="item in menu">
          <NuxtLink
            :class="[
              'px-8 h-auto flex items-center justify-center border-l border-b border-[#2C2C2C] hover:border-b-[#FA1D33] font-hostgrotesk font-medium text-md text-center text-nowrap',
              {
                'bg-[#FA1D33] text-[#121212]': route.path == item.to,
                'bg-[#121212] text-[#FA1D33]': route.path != item.to,
              },
            ]"
            :to="item.to"
            v-if="!item.admin || (item.admin && (user as any)?.admin)"
          >
            <p class="">
              {{ item.label }}
            </p>
          </NuxtLink>
        </template>
        <div
          class="min-w-[19rem] px-16 border-l border-b border-[#2C2C2C] flex items-center"
        >
          <div class="w-full flex items-center gap-4" v-if="loggedIn">
            <img class="w-11 aspect-square" :src="(user as any)?.picture" />
            <p class="font-hostgrotesk text-[#FA1D33] text-md text-center">
              {{ (user as any).given_name }}
            </p>
            <div>
              <Button class="w-full" @click="logout()" severity="warn">
                <Icon name="uil:sign-out-alt" class="text-2xl" />
              </Button>
            </div>
          </div>
          <div class="w-full" v-else>
            <Button class="w-full" severity="contrast">
              <a
                href="/api/auth/google"
                class="w-full flex gap-4 items-center justify-center"
              >
                <Icon name="uil:google" class="text-2xl" />
                <p class="text-nowrap">Sign In</p>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
