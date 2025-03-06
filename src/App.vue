<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { onMounted } from "vue";
import { useFinancesStore } from "./stores/finances.store";

const $q = useQuasar();
const finances = useFinancesStore();

$q.dark.set(true);

onMounted(async () => {
  await finances.mount();
});
</script>
