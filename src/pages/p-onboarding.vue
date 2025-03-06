<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFinancesStore } from "src/stores/finances.store";
import { useRouter } from "vue-router";
import type { Backup } from "src/interfaces";

const finances = useFinancesStore();
const router = useRouter();
const currentBalance = ref(0);

const onSubmit = async () => {
  await finances.updateBalance(currentBalance.value * 100);
  await router.push("/app");
};

onMounted(async () => {
  const settings = await finances.getSettings();
  if (settings.init) await router.push("/app");
});

const file = ref(null);
const readFile = () => {
  if (!file.value) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      if (event.target?.result) {
        await finances.loadData(JSON.parse(event.target?.result as string) as Backup);
        await router.push("/app");
      } else {
        alert("Corrupted file");
      }
    } catch (error) {
      console.error("Error al leer el archivo JSON", error);
    }
  };
  reader.readAsText(file.value);
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="row items-center justify-evenly text-white">
        <q-form @submit="onSubmit" class="q-pa-md q-gutter-md">
          <q-input
            filled
            color="white"
            v-model.number="currentBalance"
            label="Balance"
            type="number"
            prefix="S/."
            lazy-rules
            :rules="[(val) => val !== '' || 'Please type something']"
          />

          <div class="row justify-end">
            <q-btn type="submit" color="primary"> Save </q-btn>
          </div>
        </q-form>

        <q-file
          v-model="file"
          label="Subir archivo JSON"
          filled
          accept=".json"
          @update:model-value="readFile"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
