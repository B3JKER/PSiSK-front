<script setup lang="ts">
import { ref, computed } from "vue";
import slider from "vue3-slider";
import type { Patient, PatientStatus } from "../types/patient";
import dayjs from "dayjs";
// Firebase import
import { getPatient, updatePatientStatus, db } from "@/firebase";
import { ref as fref, onValue } from "firebase/database";
import type { Unsubscribe } from "@firebase/util";

// Constants
const patient = ref<Patient>();
const patientID = ref<number>(0);
const simulatedStatus = ref<PatientStatus>({
  ECG: 0.5,
  Pleth: 0.5,
  CO2: 0,
  ART: 0,
  AWP: 0,
  AWF: 11,
  AMV: 400,
});
const timer = ref();
const isStarted = ref(false);

// database listener for value events
var diagnosisListener: Unsubscribe;

/**
 * Function for searching patient by ID
 * @param id Patient ID
 */
function searchPatient(id: number) {
  getPatient(id).then((data) => {
    if (data !== undefined) {
      patient.value = data;
    } else {
      patient.value = undefined;
    }
  });
}

/**
 * Function to update patient status in database
 * @param patient Patient object
 * @param status PatientStatus object
 * @param time Current time of update
 */
function updateStatus(patient: Patient, status: PatientStatus, time: string) {
  updatePatientStatus(patient.id, time, status);
  if (patient.status) {
    patient.status[time] = status;
  } else {
    patient.status = {};
    patient.status[time] = status;
  }
}

/**
 * Function which starts the simulation of patient.
 * It create inside a listener for patient diagnosis values changes
 * and set timer for updating patient status to firebase db
 */
function startSimulation() {
  if (patient.value) {
    isStarted.value = true;
    // Listener for updates diagnosis
    const refDiagnosis = fref(
      db,
      "patients/" + patient.value.id + "/diagnosis"
    );
    diagnosisListener = onValue(refDiagnosis, (snapshot) => {
      const data = snapshot.val();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      patient.value!.diagnosis = data;
    });
    // Timer to update simulation
    timer.value = setInterval(function () {
      var actualTime = dayjs().format("DD-MM-YYYY--HH-mm-ss-SSS");
      updateStatus(
        patient.value as Patient,
        { ...simulatedStatus.value },
        actualTime
      );
    }, 1000); // Timer interval
  }
}

/**
 * Function which stop the simulation
 */
function stopSimulation() {
  isStarted.value = false;
  diagnosisListener();
  clearInterval(timer.value);
}

/**
 * Computed value with last diagnosis added in db
 */
const lastDiagnosis = computed(() => {
  if (patient.value && patient.value && patient.value.diagnosis) {
    return Object.fromEntries(
      Object.entries(patient.value.diagnosis)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 10)
    );
  }
  return {};
});
const patientStatusArray = computed(() => {
  if (patient.value && patient.value.status) {
    return Object.fromEntries(
      Object.entries(patient.value.status)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 10)
    );
  }
  return undefined;
});
</script>

<template>
  <div>
    <h1>Symulacja pacjenta</h1>
    <form @submit.prevent="searchPatient(patientID)">
      <input type="number" v-model="patientID" />
      <button type="submit">Szukaj pacjenta</button>
    </form>
    <div class="patients-grid">
      <div v-if="patient" class="patient">
        <h2>Dane pacjenta</h2>
        <div>ID Pacjenta: {{ patient.id }}</div>
        <div>
          Imię i nazwisko: {{ patient.firstName }} {{ patient.lastName }}
        </div>
        <div>
          <h3>Status pacjenta:</h3>
          <div>
            ECG
            <input type="text" v-model="simulatedStatus.ECG" />
            <slider
              v-model="simulatedStatus.ECG"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="1.5"
              :min="-0.3"
              :step="0.01"
              width="200px"
            />
          </div>
          <div>
            Pleth
            <input type="text" v-model="simulatedStatus.Pleth" />
            <slider
              v-model="simulatedStatus.Pleth"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="1.5"
              :min="0"
              :step="0.01"
              width="200px"
            />
          </div>
          <div>
            CO2
            <input type="text" v-model="simulatedStatus.CO2" />
            <slider
              v-model="simulatedStatus.CO2"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="50"
              :min="0"
              :step="0.1"
              width="200px"
            />
          </div>
          <div>
            ART
            <input type="text" v-model="simulatedStatus.ART" />
            <slider
              v-model="simulatedStatus.ART"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="200"
              :min="0"
              :step="1"
              width="200px"
            />
          </div>
          <div>
            AWP
            <input type="text" v-model="simulatedStatus.AWP" />
            <slider
              v-model="simulatedStatus.AWP"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="30"
              :min="0"
              :step="0.1"
              width="200px"
            />
          </div>
          <div>
            AWF
            <input type="text" v-model="simulatedStatus.AWF" />
            <slider
              v-model="simulatedStatus.AWF"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="60"
              :min="-20"
              :step="0.1"
              width="200px"
            />
          </div>
          <div>
            AMV
            <input type="text" v-model="simulatedStatus.AMV" />
            <slider
              v-model="simulatedStatus.AMV"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="2000"
              :min="0"
              :step="1"
              width="200px"
            />
          </div>
        </div>
        <button v-if="!isStarted" :onclick="startSimulation">
          Start simulation
        </button>
        <button v-else :onclick="stopSimulation">Stop simulation</button>
      </div>

      <div class="stats" v-if="patientStatusArray">
        <div v-if="patient && patient.diagnosis">
          Diagnosis:
          <div
            v-for="(diagnosis, time) in lastDiagnosis"
            :key="time"
            class="stats__grid__value"
          >
            {{ time }} {{ diagnosis }}
          </div>
        </div>
        <h2>Status</h2>
        <div class="stats__grid">
          <div>
            <h3>ECG</h3>
            <span
              v-for="(status, i) in patientStatusArray"
              :key="i"
              class="stats__grid__value"
            >
              {{ status.ECG }}
            </span>
          </div>
          <div>
            <h3>Pleth</h3>
            <span
              v-for="(status, i) in patientStatusArray"
              :key="i"
              class="stats__grid__value"
            >
              {{ status.Pleth }}
            </span>
          </div>
          <div>
            <h3>CO2</h3>
            <span
              v-for="(status, i) in patientStatusArray"
              :key="i"
              class="stats__grid__value"
            >
              {{ status.CO2 }}
            </span>
          </div>
          <div>
            <h3>ART</h3>
            <span
              v-for="(status, i) in patientStatusArray"
              :key="i"
              class="stats__grid__value"
            >
              {{ status.ART }}
            </span>
          </div>
          <div>
            <h3>AWP</h3>
            <span
              v-for="(status, i) in patientStatusArray"
              :key="i"
              class="stats__grid__value"
            >
              {{ status.AWP }}
            </span>
          </div>
          <div>
            <h3>AWF</h3>
            <span
              v-for="(status, i) in patientStatusArray"
              :key="i"
              class="stats__grid__value"
            >
              {{ status.AWF }}
            </span>
          </div>
          <div>
            <h3>AMV</h3>
            <span
              v-for="(status, i) in patientStatusArray"
              :key="i"
              class="stats__grid__value"
            >
              {{ status.AMV }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patients-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 80%;
  margin-top: 100px;
}
.stats {
  display: flex;
  flex-flow: wrap column;
  &__grid {
    display: grid;
    grid-template-rows: repeat(7, 1fr);
    &__value {
      margin-right: 10px;
    }
  }
}
</style>
