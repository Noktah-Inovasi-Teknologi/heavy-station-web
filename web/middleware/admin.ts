export default defineEventHandler(async (event) => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const { sub, email } = user.value as any;
  const isAdmin = sub === process.env.ADMIN_SUB && email === process.env.ADMIN_EMAIL;

  if (!isAdmin) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
});
