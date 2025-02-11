export async function hasPermissions(permissionList: string[], withPermissions: boolean = false): Promise<{ value: boolean; permissions?: any}> {
  const client = useKindeClient();
  const { data: permissions } = await useAsyncData(async () => {
    const { permissions } = (await client?.getPermissions()) ?? {};
    return permissions;
  });
  if (permissions.value && Array.isArray(permissions.value)) {
    if (withPermissions) {
      return { value: permissionList.every((permission) => (permissions.value as any).includes(permission)), permissions: permissions.value };
    } else {
    return { value: permissionList.every((permission) =>
      (permissions.value as any).includes(permission)
    )};
   }
  }
  if (withPermissions) {
    return { value: false, permissions: permissions.value };
  } else {
    return { value: false };
  }
}

export async function loadUser() {
  const client = useKindeClient();
  const { data: user } = await useAsyncData(async () => {
    const user = (await client?.getUser()) ?? {};
    return user;
  });
  return user.value;
}
