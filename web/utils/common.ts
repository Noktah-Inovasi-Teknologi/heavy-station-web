export async function hasPermissions(permissionList: string[]) {
  const client = useKindeClient();
  const { data: permissions } = await useAsyncData(async () => {
    const { permissions } = await client?.getPermissions() ?? {}
    return permissions
  })
  if (Array.isArray(permissions)) {
    return permissionList.every((permission) =>
      permissions.includes(permission)
    );
  }
  return false;
}
