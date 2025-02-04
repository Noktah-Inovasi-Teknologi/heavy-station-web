<script lang="ts" setup>
const isLoaded = ref(false);

let pageSize = ref(5);

const tabs = ref([
  {
    title: "Builds",
    value: "0",
    table: "builds",
    records: [],
    totalRecords: 0,
    pageTable: 0,
    columns: [
      { header: "Code", field: "code" },
      { header: "Name", field: "name" },
      { header: "Benchmark", field: "benchmark" },
      { header: "Price Value", field: "price_value" },
      { header: "Team", field: "team" },
      { header: "Galleries", field: "galleries" },
    ],
  },
  {
    title: "Price Histories",
    value: "1",
    table: "price_histories",
    records: [],
    totalRecords: 0,
    pageTable: 0,
    columns: [],
  },
  {
    title: "User Builds",
    value: "2",
    table: "user_builds",
    records: [],
    totalRecords: 0,
    pageTable: 0,
    columns: [],
  },
]);

async function deleteItem(table: string, id: number) {
  const result = await $fetch("/api/build/single", {
    method: "DELETE",
    query: {
      id: id,
      table: table,
    },
  });
  if (result) {
    await fetchBuildsTotal();
    await fetchBuilds("builds", tabs.value[0].pageTable - 1);
  }
}
async function fetchBuildsTotal() {
  tabs.value[0].totalRecords = await $fetch("/api/read-builds-total", {
    method: "GET",
  });
}
async function fetchBuilds(table: string, pageTable: number) {
  pageTable = pageTable + 1;
  let val: any = await $fetch("/api/build/bulk", {
    method: "GET",
    params: {
      page: pageTable,
      page_size: pageSize.value,
    },
  });
  if (table === "builds" && val) {
    val.forEach((build: any) => {
      build.team = JSON.parse(build.team);
      build.galleries = JSON.parse(build.galleries);
    });
    tabs.value[0].records = val;
  }
}
onMounted(async () => {
  await fetchBuildsTotal();
  await fetchBuilds("builds", tabs.value[0].pageTable - 1);
  console.log(tabs.value);

  isLoaded.value = true;
});
</script>

<template>
  <div v-if="isLoaded">
    <Tabs value="0">
      <TabList>
        <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
          {{ tab.title }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
          <div>
            <DataTable
              lazy
              @page="fetchBuilds(tab.table, $event.page)"
              paginator
              :rows="pageSize"
              :totalRecords="tab.totalRecords"
              :value="tab.records"
            >
              <Column
                v-for="col in tab.columns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
              />
              <Column header="Actions">
                <template #body="slotProps">
                  <div class="flex gap-4">
                    <Button icon="" severity="warn">
                      <template #icon>
                        <Icon name="uil:edit" style="color: black" />
                      </template>
                    </Button>
                    <Button
                      @click="deleteItem(tab.table, slotProps.data.id)"
                      icon=""
                      severity="danger"
                    >
                      <template #icon>
                        <Icon name="uil:trash" style="color: black" />
                      </template>
                    </Button>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
