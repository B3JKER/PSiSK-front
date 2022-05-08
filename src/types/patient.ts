export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  actualDiagnosis: string;
  status: Array<PatientStatus>;
}

export interface PatientStatus {
  time: string;
  heartrate: number;
}
