<script lang="ts" setup>
import { useToast } from "primevue";

let isLoaded = ref(false);
let toast = useToast();
let data = ref<any>();

async function readComponentCSV() {
  data.value = await $fetch("/api/component", {
    method: "GET",
    params: {
      export: true,
    },
  });
  const blob = new Blob([data.value], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "components.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}
</script>
<template>
  <div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">Export Component CSV</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <Button @click="readComponentCSV()">Export</Button>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
