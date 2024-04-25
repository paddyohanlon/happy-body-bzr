<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import type { Measurement } from "@/types";
import { storeToRefs } from "pinia";
import { computed, ref, type Ref } from "vue";

const fatLossPerWeekRate = 0.795454;
const muscleGainPerWeekRate = 0.1587573;

const store = useMainStore();
const { user } = storeToRefs(store);

const newMeasurement: Ref<Measurement> = ref({
  date: new Date().toISOString(),
  weightKg: 0,
  chestCm: 0,
  bellyCm: 0,
  thighCm: 0,
});

const idealWeightFat = computed(() => user.value.goalBodyWeightKg * 0.1);
const weightToGain = computed(() => user.value.goalBodyWeightKg - user.value.measurements[0].weightKg);
const fatWeightToLose = computed(() => fatWeight(user.value.measurements[0]) - idealWeightFat.value);
const weeksToIdealFat = computed(() => fatWeightToLose.value / fatLossPerWeekRate);
const idealWeightMuscle = computed(() => user.value.goalBodyWeightKg * 0.9);
const muscleWeightToGain = computed(() => idealWeightMuscle.value - muscleWeight(user.value.measurements[0]));
const weeksToIdealMuscle = computed(() => muscleWeightToGain.value / muscleGainPerWeekRate);

function sizeTotal(measurement: Measurement): number {
  return measurement.chestCm + measurement.bellyCm + measurement.thighCm;
}

function fatPercent(measurement: Measurement): number {
  const total = sizeTotal(measurement);
  /*
      1 3/16'  = 1.1875' = 3.01625cm = 10%
      1 3/8'   = 1.375'  = 3.4925cm  = 11%
      1 9/16'  = 1.5625' = 3.96875cm = 12%
      1 3/4'   = 1.75'   = 4.445cm   = 13.5%
      2'       = 2'      = 5.08cm    = 15%
    */
  if (total <= 3.01625) return 0.1;
  if (total <= 3.4925) return 0.11;
  if (total <= 3.96875) return 0.12;
  if (total <= 4.445) return 0.13;
  if (total <= 5.08) return 0.15;
  return 16.5; // or more
}

function fatWeight(measurement: Measurement): number {
  return fatPercent(measurement) * measurement.weightKg;
}

function muscleWeight(measurement: Measurement): number {
  return measurement.weightKg - fatWeight(measurement);
}

function handleAddMeasurementSubmit(): void {
  store.addMeasurement(newMeasurement.value);
}
</script>

<template>
  <div class="container">
    <h1 class="title is-1">Measurements</h1>

    <!-- Big stats -->
    <template v-if="user.measurements && user.measurements.length > 0">
      <div class="level">
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal weight</div>
            <div class="title">{{ user.measurements[0].weightKg }}/{{ user.goalBodyWeightKg.toFixed(1) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal muscle</div>
            <div class="title">
              {{ muscleWeight(user.measurements[0]).toFixed(2) }}/{{ user.goalBodyWeightKg.toFixed(2) }}kg (90%)
            </div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal muscle %</div>
            <div class="title">{{ ((1 - fatPercent(user.measurements[0])) * 100).toFixed() }}/90%</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal fat weight</div>
            <div class="title">{{ fatWeight(user.measurements[0]).toFixed(2) }}/{{ idealWeightFat.toFixed(2) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">current/ideal fat %</div>
            <div class="title">{{ (fatPercent(user.measurements[0]) * 100).toFixed() }}/10%</div>
          </div>
        </div>
      </div>

      <div class="level">
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">weight to gain</div>
            <div class="title">{{ weightToGain.toFixed(2) }}kg</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">fat to lose</div>
            <div class="title">{{ fatWeightToLose.toFixed(2) }}kg</div>
            <div class="is-size-7">weeks remaining: {{ weeksToIdealFat.toFixed(2) }}</div>
          </div>
        </div>
        <!-- item -->
        <div class="level-item has-text-centered">
          <div>
            <div class="heading">muscle to gain</div>
            <div class="title">{{ muscleWeightToGain.toFixed(2) }}kg</div>
            <div class="is-size-7">weeks remaining: {{ weeksToIdealMuscle.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </template>

    <div class="grid-measurements">
      <!-- Form -->
      <div class="card mb-4">
        <div class="card-content">
          <div class="content">
            <form @submit.prevent="handleAddMeasurementSubmit">
              <!-- body weight -->
              <label class="label" for="body-weight">Body weight</label>
              <div class="field has-addons">
                <div class="control">
                  <input
                    id="body-weight"
                    v-model.number="newMeasurement.weightKg"
                    class="input"
                    type="text"
                    inputmode="numeric"
                  />
                </div>
                <div class="control">
                  <span class="button is-static">
                    {{ store.getWeightUnit }}
                  </span>
                </div>
              </div>

              <!-- Chest -->
              <label class="label" for="size-chest">Chest</label>
              <div class="field has-addons">
                <div class="control">
                  <input
                    id="size-chest"
                    v-model.number="newMeasurement.chestCm"
                    class="input"
                    type="text"
                    inputmode="numeric"
                  />
                </div>
                <div class="control">
                  <span class="button is-static">{{ store.getLengthUnit }}</span>
                </div>
              </div>
              <label class="label" for="size-belly">Belly</label>
              <div class="field has-addons">
                <div class="control">
                  <input
                    id="size-belly"
                    v-model.number="newMeasurement.bellyCm"
                    class="input"
                    type="text"
                    inputmode="numeric"
                  />
                </div>
                <div class="control">
                  <span class="button is-static">{{ store.getLengthUnit }}</span>
                </div>
              </div>
              <label class="label" for="size-thigh">Thigh</label>
              <div class="field has-addons">
                <div class="control">
                  <input
                    id="size-thigh"
                    v-model.number="newMeasurement.thighCm"
                    class="input"
                    type="text"
                    inputmode="numeric"
                  />
                </div>
                <div class="control">
                  <span class="button is-static">{{ store.getLengthUnit }}</span>
                </div>
              </div>
              <button class="button is-primary">Save</button>
            </form>
          </div>
        </div>
      </div>
      <!-- Measurements -->
      <div class="card mb-4">
        <div class="card-content">
          <div class="content">
            <div class="table-container" v-if="user.measurements && user.measurements.length > 0">
              <table class="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Size</th>
                    <th>Fat</th>
                    <th>Muscle</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody role="region" aria-live="polite">
                  <tr v-for="(measurement, name, index) in user.measurements" :key="index">
                    <td>{{ new Date(measurement.date).toLocaleDateString() }}</td>
                    <td>{{ measurement.weightKg }}{{ store.getWeightUnit }}</td>
                    <td>{{ sizeTotal(measurement).toFixed(2) }}{{ store.getLengthUnit }}</td>
                    <td>
                      {{ fatPercent(measurement) * 100 }}% ({{ fatWeight(measurement).toFixed(2)
                      }}{{ store.getWeightUnit }})
                    </td>
                    <td>
                      {{ (1 - fatPercent(measurement)) * 100 }}% ({{ muscleWeight(measurement).toFixed(2)
                      }}{{ store.getWeightUnit }})
                    </td>
                    <td>
                      <button class="button is-small is-info is-inverted" @click="store.deleteMeasurement(index)">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p>Time to get tracking! Add your first measurement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
