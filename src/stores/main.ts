import { computed, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { Units, type AppUser, type Measurement, type UpdateAppUser } from "@/types";
import { bzr, usersCollection } from "@/bzr";
import type { User } from "@bzr/bazaar";

export const useMainStore = defineStore("main", () => {
  const authenticated = ref(false);

  const info: Ref<User> = ref({
    id: "",
    name: "",
    handle: "",
    email: "",
  });

  const user: Ref<AppUser> = ref({
    id: "",
    goalBodyWeightKg: 0,
    units: Units.KG_CM,
    baseDBWeightKg: 3,
    measurements: [],
  });

  const getWeightUnit = computed(() => (user.value.units === Units.KG_CM ? "kg" : "lb"));
  const getLengthUnit = computed(() => (user.value.units === Units.KG_CM ? "cm" : "in"));

  const getBaseDBWeight = computed(() => {
    // TODO do system conversion
    return user.value.baseDBWeightKg;
  });

  async function fetchInfo(): Promise<void> {
    const fetchedInfo = await bzr.social.getUser();
    info.value = fetchedInfo;
  }

  async function fetchUser(): Promise<void> {
    const userId = info.value.id;

    if (!userId) return;

    let u: AppUser = {
      id: userId,
      goalBodyWeightKg: 0,
      units: Units.KG_CM,
      baseDBWeightKg: 3,
      measurements: [],
    };

    const existingUser = await usersCollection.getOne(userId);

    if (existingUser) {
      u = existingUser;
    } else {
      await usersCollection.insertOne(u);
    }

    user.value = u;
  }

  function updateUser(updateUser: UpdateAppUser): void {
    if (!user.value.id) return;

    user.value = { ...user.value, ...updateUser };
    usersCollection.updateOne(user.value.id, user.value);
  }

  /**
   * Multiply base dumbbell weight and add unit
   * @param percentOfBase Exercises require a percentage of the dumbbell base weight. Defaults to 100%
   * @returns The calculated weight with unit, e.g. 10kg
   */
  function getDBWeight(percentOfBase = 1): string {
    if (!user.value.baseDBWeightKg) return "";

    const weight = user.value.baseDBWeightKg * percentOfBase;
    return `${weight}${getWeightUnit.value}`;
  }

  function addMeasurement(measurement: Measurement): void {
    user.value.measurements.push(measurement);
    usersCollection.updateOne(user.value.id, user.value);
  }

  async function deleteMeasurement(index: number) {
    user.value.measurements.splice(index, 1);
    usersCollection.replaceOne(user.value.id, user.value);
  }

  return {
    authenticated,
    user,
    getWeightUnit,
    getLengthUnit,
    getBaseDBWeight,
    updateUser,
    getDBWeight,
    fetchInfo,
    fetchUser,
    addMeasurement,
    deleteMeasurement,
  };
});
