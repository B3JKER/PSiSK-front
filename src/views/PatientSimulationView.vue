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
    }, 10); // Timer interval
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
        .slice(0, 200)
    );
  }
  return undefined;
});

const forCharts = computed(() => {
  if (patientStatusArray.value) {
    // var testowo: Array<{ [key: string]: number }> = [];
    var testowo: Array<{ [key: string]: number }> = [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ];
    for (const [key, value] of Object.entries(patientStatusArray.value)) {
      var slicedKey = key.slice(12).replaceAll("-", ":");
      testowo[0][slicedKey] = value.ECG;
      testowo[1][slicedKey] = value.Pleth;
      testowo[2][slicedKey] = value.CO2;
      testowo[3][slicedKey] = value.ART;
      testowo[4][slicedKey] = value.AWP;
      testowo[5][slicedKey] = value.AWF;
      testowo[6][slicedKey] = value.AMV;
    }
    return testowo;
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
            <div>{{ simulatedStatus.ECG.toFixed(2) }}</div>
            <slider
              v-model="simulatedStatus.ECG"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="1.5"
              :min="-0.3"
              :step="0.01"
            />
          </div>
          <div>
            Pleth
            <div>{{ simulatedStatus.Pleth.toFixed(2) }}</div>
            <slider
              v-model="simulatedStatus.Pleth"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="1.5"
              :min="0"
              :step="0.01"
            />
          </div>
          <div>
            CO2
            <div>{{ simulatedStatus.CO2.toFixed(2) }}</div>
            <slider
              v-model="simulatedStatus.CO2"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="50"
              :min="0"
              :step="0.1"
            />
          </div>
          <div>
            ART
            <div>{{ simulatedStatus.ART.toFixed(2) }}</div>
            <slider
              v-model="simulatedStatus.ART"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="200"
              :min="0"
              :step="1"
            />
          </div>
          <div>
            AWP
            <div>{{ simulatedStatus.AWP.toFixed(2) }}</div>
            <slider
              v-model="simulatedStatus.AWP"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="30"
              :min="0"
              :step="0.1"
            />
          </div>
          <div>
            AWF
            <div>{{ simulatedStatus.AWF.toFixed(2) }}</div>
            <slider
              v-model="simulatedStatus.AWF"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="60"
              :min="-20"
              :step="0.1"
            />
          </div>
          <div>
            AMV
            <div>{{ simulatedStatus.AMV.toFixed(2) }}</div>
            <slider
              v-model="simulatedStatus.AMV"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="2000"
              :min="0"
              :step="1"
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
            <div class="stats__grid__value">
              <line-chart
                :data="forCharts ? forCharts[0] : {}"
                xtitle="Time"
                ytitle="ECG"
              >
              </line-chart>
            </div>
          </div>
          <div>
            <div class="stats__grid__value">
              <line-chart
                :data="forCharts ? forCharts[1] : {}"
                xtitle="Time"
                ytitle="Pleth"
              ></line-chart>
            </div>
          </div>
          <div>
            <div class="stats__grid__value">
              <line-chart
                :data="forCharts ? forCharts[2] : {}"
                xtitle="Time"
                ytitle="CO2"
              ></line-chart>
            </div>
          </div>
          <div>
            <div class="stats__grid__value">
              <line-chart
                :data="forCharts ? forCharts[3] : {}"
                xtitle="Time"
                ytitle="ART"
              ></line-chart>
            </div>
          </div>
          <div>
            <div class="stats__grid__value">
              <line-chart
                :data="forCharts ? forCharts[4] : {}"
                xtitle="Time"
                ytitle="AWP"
              ></line-chart>
            </div>
          </div>
          <div>
            <div class="stats__grid__value">
              <line-chart
                :data="forCharts ? forCharts[5] : {}"
                xtitle="Time"
                ytitle="AWF"
              ></line-chart>
            </div>
          </div>
          <div>
            <div class="stats__grid__value">
              <line-chart
                :data="forCharts ? forCharts[6] : {}"
                xtitle="Time"
                ytitle="AMV"
              ></line-chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient {
  padding-right: 20px;
}
.patients-grid {
  display: grid;
  grid-template-columns: 0.2fr 1fr;
  width: 100%;
  margin-top: 50px;
}
.stats {
  display: flex;
  flex-flow: wrap column;
  background-color: white;
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    &__value {
      margin-right: 10px;
    }
  }
}
</style>
