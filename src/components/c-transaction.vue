<script setup lang="ts">
import { type Transaction } from "src/interfaces";
import { formatBalance } from "src/utils/formatter";

defineProps<Transaction>();
</script>

<template>
  <q-item clickable v-ripple>
    <q-item-section>
      <q-item-label :class="`Label text-${amount >= 0 ? 'red' : 'green'}`">
        S/. {{ formatBalance(amount) }}
      </q-item-label>
      <q-item-label class="Date" caption>
        {{ new Date(date).toLocaleString() }}
      </q-item-label>
      <q-item-label class="Description" caption>{{ description }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped lang="sass">
.Label
  font-size: 1.4rem

.Date
  font-size: 0.9rem

.Description
  font-size: 1.1rem
</style>
