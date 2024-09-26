<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import type { UpdateAppUser } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch, type Ref } from "vue";

const store = useMainStore();
const { user } = storeToRefs(store);

const updateUser: Ref<UpdateAppUser> = ref(createUpdateUser());

watch(user, (newVal) => {
  if (!newVal) return;

  updateUser.value = createUpdateUser();
});

function createUpdateUser() {
  return {
    goalBodyWeightKg: user.value.goalBodyWeightKg,
    units: user.value.units,
  };
}

function handleUpdateUserSubmit(): void {
  store.updateUser(updateUser.value);
}
</script>

<template>
  <div class="small-container">
    <h1 class="title is-1">Profile</h1>

    <div v-if="!updateUser.goalBodyWeightKg" class="notification is-info mb-4">
      Fill in your ideal weight to calculate your progress as you add measurements.
    </div>

    <div class="card mb-4">
      <div class="card-content">
        <div class="content">
          <form @submit.prevent="handleUpdateUserSubmit">
            <label class="label" for="ideal-weight">Ideal weight</label>
            <div class="field has-addons mb-5">
              <div class="control">
                <input
                  id="ideal-weight"
                  v-model.number="updateUser.goalBodyWeightKg"
                  class="input"
                  inputmode="decimal"
                />
              </div>
              <div class="control">
                <span class="button is-static">{{ store.getWeightUnit }}</span>
              </div>
            </div>

            <div class="field mb-5">
              <div class="label">Measurement system</div>
              <p>No conversion will take place when units are changed.</p>
              <div class="control">
                <label class="radio">
                  <input type="radio" v-model="updateUser.units" value="kg_cm" />
                  KG and CM
                </label>
                <label class="radio">
                  <input type="radio" v-model="updateUser.units" value="lb_in" />
                  LB and IN
                </label>
              </div>
            </div>

            <button class="button is-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
