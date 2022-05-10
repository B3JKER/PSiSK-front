export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  diagnosis?: { [key: string]: string };
  status?: { [key: string]: PatientStatus };
}

export interface PatientStatus {
  heartrate: number;
}
