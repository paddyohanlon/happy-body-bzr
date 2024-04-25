<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/AppNav.vue";
import { bzr } from "./bzr";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";

const store = useMainStore();
const { authenticated } = storeToRefs(store);

async function handleLogin() {
  authenticated.value = true;

  await store.fetchInfo();
  await store.fetchUser();
}

bzr.onLogin(handleLogin);

if (bzr.isLoggedIn()) {
  handleLogin();
}
</script>

<template>
  <NavBar />
  <div class="section">
    <RouterView />
  </div>
</template>

<style lang="scss">
@import "bulma/sass/utilities/";

.navbar-brand {
  font-weight: bold;
}

.small-container {
  margin: 0 auto;
  max-width: 440px;
}
</style>
