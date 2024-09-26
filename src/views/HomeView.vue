<script setup lang="ts">
import { bzr } from "@/bzr";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const store = useMainStore();
const { authenticated, getWeightUnit, getBaseDBWeight } = storeToRefs(store);

const updateBaseDBWeight = ref(getBaseDBWeight.value);

watch(getBaseDBWeight, (newVal) => {
  if (!newVal) return;

  updateBaseDBWeight.value = newVal;
});

function handleUpdateUserSubmit(): void {
  store.updateUser({ baseDBWeightKg: updateBaseDBWeight.value });
}

async function login() {
  try {
    await bzr.login();
  } catch (e: any) {
    console.log("e.message", e.message);
  }
}
</script>

<template>
  <main>
    <template v-if="!authenticated">
      <button class="button is-primary" @click="login">Log in or Sign up</button>
    </template>
    <template v-else>
      <h1 class="title is-1">What dumbbells do you need?</h1>

      <div class="grid-dumbbells">
        <div class="card mb-4">
          <div class="card-content">
            <form @submit.prevent="handleUpdateUserSubmit">
              <label class="label" for="base-weight">100% weight of one dumbbell</label>

              <div class="field is-grouped">
                <div class="control is-expanded">
                  <div class="field has-addons">
                    <div class="control">
                      <input
                        id="base-weight"
                        v-model.number="updateBaseDBWeight"
                        class="input"
                        type="text"
                        inputmode="numeric"
                      />
                    </div>
                    <div class="control">
                      <span class="button is-static">
                        {{ getWeightUnit }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="control">
                  <button class="button is-primary">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-content">
            <div class="level" role="region" aria-live="polite">
              <!-- Weights -->
              <!-- item -->
              <div class="level-item has-text-centered">
                <div>
                  <div class="heading">50%</div>
                  <div class="title">2 &times; {{ store.getDBWeight(0.5) }}</div>
                </div>
              </div>
              <!-- item -->
              <div class="level-item has-text-centered">
                <div>
                  <div class="heading">100%</div>
                  <div class="title">2 &times; {{ store.getDBWeight() }}</div>
                </div>
              </div>
              <!-- item -->
              <div class="level-item has-text-centered">
                <div>
                  <div class="heading">150%</div>
                  <div class="title">2 &times; {{ store.getDBWeight(1.5) }}</div>
                </div>
              </div>
              <!-- item -->
              <div class="level-item has-text-centered">
                <div>
                  <div class="heading">200%</div>
                  <div class="title">1 &times; {{ store.getDBWeight(2) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-content">
          <div class="table-container">
            <table class="table has-thead-tds-centered has-tds-centered">
              <thead>
                <tr>
                  <th></th>
                  <th>Exercise 1</th>
                  <th>Exercise 2</th>
                  <th>Exercise 3</th>
                  <th>Exercise 4</th>
                  <th>Exercise 5</th>
                  <th>Exercise 6</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Sequence 1</th>
                  <td>
                    <div class="heading">100%</div>
                    <div>2 &times; {{ store.getDBWeight() }}</div>
                  </td>
                  <td>
                    <div class="heading">&mdash;</div>
                    <div>Body weight</div>
                  </td>
                  <td>
                    <div class="heading">&mdash;</div>
                    <div>Body weight</div>
                  </td>
                  <td>
                    <div class="heading">150%</div>
                    <div>1 &times; {{ store.getDBWeight(1.5) }}</div>
                  </td>
                  <td>
                    <div class="heading">200%</div>
                    <div>1 &times; {{ store.getDBWeight(2) }}</div>
                  </td>
                  <td>
                    <div class="heading">150%</div>
                    <div>2 &times; {{ store.getDBWeight(1.5) }}</div>
                  </td>
                </tr>
                <tr>
                  <th>Sequence 2</th>
                  <td>
                    <div class="heading">50%</div>
                    <div>2 &times; {{ store.getDBWeight(0.5) }}</div>
                  </td>
                  <td>
                    <div class="heading">&mdash;</div>
                    <div>Body weight</div>
                  </td>
                  <td>
                    <div class="heading">&mdash;</div>
                    <div>Body weight</div>
                  </td>
                  <td>
                    <div class="heading">200%</div>
                    <div>1 &times; {{ store.getDBWeight(2) }}</div>
                  </td>
                  <td>
                    <div class="heading">100%</div>
                    <div>2 &times; {{ store.getDBWeight() }}</div>
                  </td>
                  <td>
                    <div class="heading">150%</div>
                    <div>2 &times; {{ store.getDBWeight(1.5) }}</div>
                  </td>
                </tr>
                <tr>
                  <th>Sequence 3</th>
                  <td>
                    <div class="heading">150%</div>
                    <div>1 &times; {{ store.getDBWeight(1.5) }}</div>
                  </td>
                  <td>
                    <div class="heading">&mdash;</div>
                    <div>Body weight</div>
                  </td>
                  <td>
                    <div class="heading">&mdash;</div>
                    <div>Body weight</div>
                  </td>
                  <td>
                    <div class="heading">50%</div>
                    <div>2 &times; {{ store.getDBWeight(0.5) }}</div>
                  </td>
                  <td>
                    <div class="heading">100%</div>
                    <div>2 &times; {{ store.getDBWeight() }}</div>
                  </td>
                  <td>
                    <div class="heading">150%</div>
                    <div>2 &times; {{ store.getDBWeight(1.5) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-content">
          <p>This tool is a dumbbell calculator for <a href="https://thehappybody.com/">The Happy Body</a> Program.</p>
          <p>
            Despite the percentages seeming simple at first, I found it takes quite a bit of mental work to remember
            whether 100% is for one dumbbells or two (it's for one), which exercises use two dumbbells, which use one,
            and how many dumbbells and at what weights do I actually need.
          </p>
          <p>
            This simple calculator aims to make answering those questions easy. Just enter your starting 100% weight,
            for Sequence 1, Exercise 1 (1:1), and the rest will automatically be calculated for you.
          </p>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.grid-dumbbells {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1em;
}

table.has-tds-centered td:not([align]),
table th:not([align]) {
  text-align: center;
}

table.has-thead-tds-centered thead th:not([align]) {
  text-align: center;
}
</style>
