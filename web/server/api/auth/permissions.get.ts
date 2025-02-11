export default defineEventHandler(async (event) => {
    const client = event.context.kinde;
    const { permissions } = await client.getPermissions();
    return permissions;
});