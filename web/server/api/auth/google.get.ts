import { useState } from "nuxt/app";

export default defineOAuthGoogleEventHandler({
  // config(event) {
    
  // }
  // async onError(event, error) {
  //   return console.log("error happened", error, event);
  // },
  async onSuccess(event, { user }) {
    console.log("This actually succeed", event, user)
    user.admin = user.email === process.env.ADMIN_EMAIL && user.sub === process.env.ADMIN_SUB;
    await setUserSession(event, { user });
    return sendRedirect(event, "/");
  },
});
// export default defineEventHandler((event) => {
//   console.log(event)
//   return "Auth can be accessed";
// })
