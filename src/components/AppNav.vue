<script setup lang="ts">
import { bzr } from "@/bzr";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const store = useMainStore();
const { authenticated } = storeToRefs(store);

const isActive = ref(false);
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">The Happy Body Tracker</a>

      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': isActive }"
        aria-label="menu"
        aria-expanded="false"
        data-target="nav"
        @click="isActive = !isActive"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div v-if="authenticated" id="nav" class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-start">
        <router-link :to="{ name: 'home' }" class="navbar-item">Weights</router-link>
        <RouterLink :to="{ name: 'measurements' }" class="navbar-item">Measurements</RouterLink>
        <router-link :to="{ name: 'profile' }" class="navbar-item">Profile</router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button class="button" @click="bzr.logOut">Log out</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
