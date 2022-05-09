export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  actualDiagnosis?: string;
  status?: { [key: string]: PatientStatus };
}

export interface PatientStatus {
  heartrate: number;
}
