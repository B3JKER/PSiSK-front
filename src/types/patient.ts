export interface PatientStatus {
  ECG: number;
  Pleth: number;
  CO2: number;
  ART: number;
  AWP: number;
  AWF: number;
  AWV: number;
}

export type Status = { [key: string]: PatientStatus };

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  diagnosis?: { [key: string]: string };
  status?: Status;
}
