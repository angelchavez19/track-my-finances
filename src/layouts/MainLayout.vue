<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- <q-footer class="bg-primary">
      <q-tabs v-model="tab" class="text-teal">
        <q-route-tab to="/app" exact icon="home" label="Home" class="text-white" />
        <q-route-tab
          to="/app/transactions"
          exact
          icon="list"
          label="Transactions"
          class="text-white"
        />
        <q-route-tab
          to="/app/settings"
          exact
          name="settings"
          icon="settings"
          label="Settings"
          class="text-white"
        />
      </q-tabs>
    </q-footer> -->
  </q-layout>
</template>

//
<script setup lang="ts">
// import { ref } from "vue";

// const tab = ref("home");
//
</script>
