<script setup lang="ts">
import { useFinancesStore } from "src/stores/finances.store";
import { ref } from "vue";

const store = useFinancesStore();
const show = defineModel<boolean>({ default: false });

const amount = ref();
const description = ref("");

const saveTransaction = async () => {
  await store.addTransaction(amount.value * 100, description.value);
  cancel();
};

const cancel = () => {
  amount.value = undefined;
  description.value = "";
  show.value = false;
};
</script>

<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6">Add transaction</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          filled
          color="white"
          v-model.number="amount"
          label="Amount"
          type="number"
          prefix="S/."
          lazy-rules
          :rules="[(val) => val !== '' || 'Please type something']"
        />

        <q-input
          filled
          color="white"
          v-model="description"
          label="Description"
          type="text"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Save" color="primary" @click="saveTransaction" />
        <q-btn label="Cancel" color="secondary" @click="cancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass"></style>
