<script lang="ts" setup>
// import { hasPermissions } from '../utils/common';

interface MenuItem {
  label: string;
  to: string;
  permissions?: string[];
}

let route = useRoute();
let menu = ref<MenuItem[]>([
  {
    label: "Katalog",
    to: "/",
  },
  {
    label: "Simulasi Rakit PC",
    to: "/simulasi-rakit-pc",
  },
  {
    label: "Dasbor",
    to: "/dashboard",
    permissions: ["dashboard"],
  },
]);
let hasAdminPermission = ref(false);

const client = useKindeClient();

const { data: permissions } = await useAsyncData(async () => {
  const { permissions } = (await client?.getPermissions()) ?? {};
  return permissions;
});

console.log("permissions", permissions);

const hasPermissions = (permissions: string[]) => {
  return permissions.every((permission) => {
    return (permissions as string[]).includes(permission);
  });
};
onMounted(async () => {
  // hasAdminPermission.value = await hasPermissions(["dashboard"]);
  console.log(await hasPermissions(["dashboard"]));
});
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
            v-if="!item.permissions || hasPermissions(item.permissions)"
          >
            <p class="">
              {{ item.label }}
            </p>
          </NuxtLink>
        </template>
        <div
          class="min-w-[19rem] px-16 border-l border-b border-[#2C2C2C] flex items-center"
        >
          <div class="w-full flex items-center gap-4" v-if="$auth.loggedIn">
            <img
              class="w-11 aspect-square"
              :src="($auth.user as any)?.picture"
            />
            <p class="font-hostgrotesk text-[#FA1D33] text-md text-center">
              {{ ($auth.user as any).name }}
            </p>
            <div>
              <Button class="w-full" severity="warn">
                <a
                  href="/api/logout"
                  class="w-full flex gap-4 items-center justify-center"
                >
                  <Icon name="uil:sign-out-alt" class="text-2xl" />
                </a>
              </Button>
            </div>
          </div>
          <div class="w-full" v-else>
            <Button class="w-full" severity="contrast">
              <a
                href="/api/login"
                class="w-full flex gap-4 items-center justify-center"
              >
                <Icon name="uil:google" class="text-2xl" />
                <p class="text-nowrap">Sign In</p>
              </a>
            </Button>
            <div class="pt-1 flex items-center justify-between">
              <p class="text-[#AFAFAF] text-sm">Belum punya akun?</p>
              <NuxtLink
                class="text-[#FA1D33] text-sm hover:underline"
                to="/api/register"
                external
              >
                Daftar
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
