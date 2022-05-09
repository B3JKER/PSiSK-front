<script setup lang="ts">
import { ref } from "vue";
import slider from "vue3-slider";
import type { Patient, PatientStatus } from "../types/patient";
import { getPatient } from "@/firebase";

const patient = ref<Patient>();

function searchPatient(id: number) {
  getPatient(1).then((data) => {
    if (data !== undefined) {
      patient.value = data;
    }
  });
}

const simulatedHeartrate = ref(80);
const timer = ref();
const isStarted = ref(false);

function updateStatus(patient: Patient, status: PatientStatus) {
  if (patient.status) {
    patient.status.push({
      time: status.time,
      heartrate: status.heartrate,
    });
  } else {
    patient.status = [];
    patient.status.push({
      time: status.time,
      heartrate: status.heartrate,
    });
  }
}

function startSimulation() {
  if (patient.value !== undefined) {
    isStarted.value = true;
    timer.value = setInterval(function () {
      var actualTime = new Date();
      updateStatus(patient.value as Patient, {
        time: actualTime.toLocaleTimeString(),
        heartrate: simulatedHeartrate.value,
      });
    }, 1000);
  }
}

function stopSimulation() {
  isStarted.value = false;
  clearInterval(timer.value);
}
</script>

<template>
  <div class="patients-grid">
    <div v-if="patient" class="patient">
      <h2>Dane pacjenta</h2>
      <div>ID Pacjenta: {{ patient.id }}</div>
      <div>Imię i nazwisko: {{ patient.firstName }} {{ patient.lastName }}</div>
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
    <div v-if="patient && patient.status">
      {{ patient.status[patient.status.length - 1] }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patients-grid {
  display: grid;
  width: 80%;
}
</style>
