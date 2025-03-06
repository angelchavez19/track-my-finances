<script setup lang="ts">
import addTransaction from "src/components/c-add-transaction.vue";
import cTransaction from "src/components/c-transaction.vue";
import { useFinancesStore } from "src/stores/finances.store";
import { formatBalance } from "src/utils/formatter";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const store = useFinancesStore();
const router = useRouter();

const showAddTransaction = ref(false);

onMounted(async () => {
  if (!(await store.getSettings()).init) {
    await router.push("/");
  }
});
</script>

<template>
  <q-page class="column text-white">
    <div class="Container bg-secondary">
      <div class="Balance bg-primary q-pa-md">
        <span class="">Balance</span>
        <span class="text-h6">S/. {{ formatBalance(store.balance) }}</span>
      </div>
    </div>

    <div class="Transaction">
      <q-btn
        color="primary"
        icon="add"
        label="Add Transaction"
        @click="showAddTransaction = true"
      />

      <addTransaction v-model="showAddTransaction" />
    </div>

    <div class="Transactions">
      <q-list
        class="q-mx-md"
        style="width: 100%"
        v-if="store.transactions.length"
        bordered
        separator
      >
        <cTransaction
          v-for="transaction in store.transactions"
          :key="transaction.date"
          v-bind="transaction"
        />
      </q-list>
      <p v-else>Transactions not found</p>
    </div>
  </q-page>
</template>

<style scoped lang="sass">
.Container
  display: flex
  align-items: center
  justify-content: center
  gap: 1rem
  width: 100%
  height: 150px
  padding: 0 2rem

  .Balance
    display: flex
    flex-direction: column
    width: 180px
    border-radius: 12px

.Transaction
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100px

.Transactions
  display: flex
  align-items: center
  justify-content: center
  width: 100%
</style>
