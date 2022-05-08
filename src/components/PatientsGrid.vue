<script setup lang="ts">
import { ref } from "vue";
import slider from "vue3-slider";
import type { Patient, PatientStatus } from "../types/patient";

const patient_1 = ref<Patient>({
  id: 0,
  firstName: "Paweł",
  lastName: "Piekarz",
  actualDiagnosis: "good",
  status: [
    {
      time: "15:23:44",
      heartrate: 80,
      // diagnosis: "good",
    },
    {
      time: "15:23:43",
      heartrate: 75,
      // diagnosis: "good",
    },
  ],
});

const simulatedHeartrate = ref(0);
const timer = ref();

function updateStatus(patient: Patient, status: PatientStatus) {
  patient.status.push({
    time: status.time,
    heartrate: status.heartrate,
  });
}

function startSimulation() {
  if (timer.value != null) {
    return;
  }
  timer.value = setInterval(function () {
    var actualTime = new Date();
    updateStatus(patient_1.value, {
      time: actualTime.toLocaleTimeString(),
      heartrate: simulatedHeartrate.value,
    });
  }, 1000);
}
function stopSimulation() {
  clearInterval(timer.value);
}

// const patients = [
//   {
//     id: 0,
//     firstName: "Paweł",
//     lastName: "Piekarz",
//     actualDiagnosis: "good",
//     status: [
//       {
//         time: "15:23:44",
//         heartrate: 80,
//         // diagnosis: "good",
//       },
//       {
//         time: "15:23:43",
//         heartrate: 75,
//         // diagnosis: "good",
//       },
//     ],
//   },
// ];
</script>

<template>
  <div class="patients-grid">
    <div class="patient">
      <h2>Dane pacjenta</h2>
      <div>ID Pacjenta: {{ patient_1.id }}</div>
      <div>
        Imię i nazwisko: {{ patient_1.firstName }} {{ patient_1.lastName }}
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
            max="200"
            width="200px"
          />
        </div>
      </div>
      <button :onclick="startSimulation">Start simulation</button>
      <button :onclick="stopSimulation">Stop simulation</button>
    </div>
    <div>
      {{ patient_1.status[patient_1.status.length - 1] }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patients-grid {
  display: grid;
  width: 80%;
}
</style>
