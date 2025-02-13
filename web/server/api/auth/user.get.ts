export default defineEventHandler(async (event) => {
    const client = event.context.kinde;
    const user = await client.getUser();
    return user;
});