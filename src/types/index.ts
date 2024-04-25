export type AppUser = {
  /** User's Bazaar ID */
  id: string;
  goalBodyWeightKg: number;
  units: Units;
  baseDBWeightKg: number;
  measurements: Measurement[];
};

export type UpdateAppUser = {
  goalBodyWeightKg?: number;
  units?: Units;
  baseDBWeightKg?: number;
  measurements?: Measurement[];
};

export type Measurement = {
  date: string; // date ISO
  weightKg: number;
  chestCm: number;
  bellyCm: number;
  thighCm: number;
};

export enum Units {
  KG_CM = "kg_cm",
  LB_IN = "lb_in",
}
