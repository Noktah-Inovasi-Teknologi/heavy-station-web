import { useState } from "nuxt/app";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    user.admin = user.email === process.env.ADMIN_EMAIL && user.sub === process.env.ADMIN_SUB;
    await setUserSession(event, { user });
    return sendRedirect(event, "/");
  },
});
