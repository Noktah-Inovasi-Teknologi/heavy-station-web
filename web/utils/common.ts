export async function hasPermissions(permissionList: string[]) {
  const permissions = await useFetch("/api/auth/permissions", {
    method: "GET",
  });
  console.log("Her elies permissions", permissions.data.value);
  return { value: permissionList.every((permission) => permissions.data.value.includes(permission)) };
}

export async function loadUser() {
  const client = useKindeClient();
  const { data: user } = await useAsyncData(async () => {
    const user = (await client?.getUser()) ?? {};
    return user;
  });
  return user.value;
}
