<script setup lang="ts">
import { ref } from "vue";
import slider from "vue3-slider";
import type { Patient, PatientStatus } from "../types/patient";
import { getPatient, updatePatientStatus } from "@/firebase";
import dayjs from "dayjs";

const patient = ref<Patient>();
const patientID = ref<number>(0);
function searchPatient(id: number) {
  getPatient(id).then((data) => {
    if (data !== undefined) {
      patient.value = data;
    } else {
      patient.value = undefined;
    }
  });
}

const simulatedHeartrate = ref(80);
const timer = ref();
const isStarted = ref(false);

function updateStatus(patient: Patient, status: PatientStatus, time: string) {
  updatePatientStatus(patient.id, time, status);
  if (patient.status) {
    patient.status[time] = status;
  } else {
    patient.status = {};
    patient.status[time] = status;
  }
}

function startSimulation() {
  if (patient.value !== undefined) {
    isStarted.value = true;
    timer.value = setInterval(function () {
      var actualTime = dayjs().format("DD-MM-YYYY--HH-mm-ss-SSS");
      updateStatus(
        patient.value as Patient,
        {
          heartrate: simulatedHeartrate.value,
        },
        actualTime
      );
    }, 5);
  }
}

function stopSimulation() {
  isStarted.value = false;
  clearInterval(timer.value);
}
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
            Tętno:
            <input type="text" v-model="simulatedHeartrate" />
            <slider
              v-model="simulatedHeartrate"
              color="#FB278D"
              track-color="#FEFEFE"
              :max="200"
              width="200px"
            />
          </div>
        </div>
        <button v-if="!isStarted" :onclick="startSimulation">
          Start simulation
        </button>
        <button v-else :onclick="stopSimulation">Stop simulation</button>
      </div>
      <div class="stats" v-if="patient && patient.status">
        <div v-for="x in 50" :key="x">
          {{
            patient.status[
              Object.keys(patient.status)[
                Object.keys(patient.status).length - x
              ]
            ].heartrate
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patients-grid {
  display: grid;
  width: 80%;
  margin-top: 100px;
}
.stats {
  display: flex;
  & > * {
    margin-right: 10px;
  }
}
</style>
