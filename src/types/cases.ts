import type { PatientStatus } from "./patient";

export type Cases = {
  healthyCases: Array<{ data: Array<PatientStatus> }>;
  heartAttackCases: Array<{ data: Array<PatientStatus> }>;
};
