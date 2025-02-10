export async function hasPermissions(permissionList: string[]) {
  const client = useKindeClient();
  const { data: permissions } = await useAsyncData(async () => {
    const { permissions } = (await client?.getPermissions()) ?? {};
    return permissions;
  });
  if (permissions.value && Array.isArray(permissions.value)) {
    return permissionList.every((permission) =>
      (permissions.value as any).includes(permission)
    );
  }
  return false;
}
