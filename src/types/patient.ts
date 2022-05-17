export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  diagnosis?: { [key: string]: string };
  status?: { [key: string]: PatientStatus };
}

export interface PatientStatus {
  ECG: number;
  Pleth: number;
  CO2: number;
  ART: number;
  AWP: number;
  AWF: number;
  AMV: number;
}
