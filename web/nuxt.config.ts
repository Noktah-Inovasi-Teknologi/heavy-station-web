// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Tomorrow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
        },
      ],
    },
  },
  compatibilityDate: "2024-11-01",
  css: ["@/assets/styles/tailwind.css", "@/assets/styles/base.css"],
  devtools: { enabled: true },
  nitro: {
    experimental: {
      database: true,
    },
    database: {
      default: {
        connector: "sqlite",
        options: {
          filename: "./db.sqlite3",
        }
      }
    }
  },
  modules: ["@primevue/nuxt-module", "@nuxtjs/tailwindcss", "@nuxt/icon", "nuxt-auth-utils"],
  primevue: {
    options: {
      theme: "none",
    },
  },
});