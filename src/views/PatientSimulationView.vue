<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Patient, PatientStatus } from "../types/patient";
import dayjs from "dayjs";
// Firebase import
import { getPatient, updatePatientStatus, db } from "@/firebase";
import { ref as fref, onValue } from "firebase/database";
import type { Unsubscribe } from "@firebase/util";

// import cases
import heart_attack_1_json from "../assets/cases/heart_attack_1.json";
import heart_attack_2_json from "../assets/cases/heart_attack_2.json";
import healthy_json from "../assets/cases/healthy.json";

const heartAttackCase1: Array<PatientStatus> = heart_attack_1_json.data;
const heartAttackCase2: Array<PatientStatus> = heart_attack_2_json.data;
// const heartAttackCase3: Array<PatientStatus> = heart_attack_3_json.data;
const healthyCase: Array<PatientStatus> = healthy_json.data;

// Constants
const patient = ref<Patient>();
const patientID = ref<number>(0);
const timer = ref();
const freq = ref(20); // Timer interval in ms
const isStarted = ref(false);
const choosedCase = ref<Array<PatientStatus>>(healthyCase);
const choosedCaseID = ref<number>(0);
const showCharts = ref<number>(0);
const slicedStatus = ref();

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
      if (data.status) {
        var sliced = data.status;
        const arrayLen = Object.entries(sliced).length;
        slicedStatus.value = Object.entries(sliced).slice(
          arrayLen - 380 < 0 ? 0 : arrayLen - 380,
          arrayLen
        );
      } else {
        slicedStatus.value = undefined;
      }
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
  if (slicedStatus.value) {
    if (slicedStatus.value.length > 380) slicedStatus.value.shift();
    slicedStatus.value.push([time, status]);
  } else {
    slicedStatus.value = [];
    slicedStatus.value.push([time, status]);
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
      if (patient.value) patient.value.diagnosis = data;
    });
    var i = 0;
    // Timer to update simulation
    timer.value = setInterval(function () {
      if (i >= choosedCase.value.length - 1) i = 0;
      else i++;
      var actualTime = dayjs().valueOf().toString();
      updateStatus(patient.value as Patient, choosedCase.value[i], actualTime);
    }, freq.value); // Timer interval
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
        .slice(0, 1)
    );
  }
  return {};
});

const forCharts = computed(() => {
  if (slicedStatus.value) {
    var testowo: Array<{ [key: string]: number }> = [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ];
    for (const [key, value] of slicedStatus.value) {
      const keyInt = parseInt(key);
      var slicedKey = dayjs(keyInt).format("HH:mm:ss:SSS");
      testowo[0][slicedKey] = value.ECG;
      testowo[1][slicedKey] = value.Pleth;
      testowo[2][slicedKey] = value.CO2;
      testowo[3][slicedKey] = value.ART;
      testowo[4][slicedKey] = value.AWP;
      testowo[5][slicedKey] = value.AWF;
      testowo[6][slicedKey] = value.AWV;
    }
    return testowo;
  }
  return undefined;
});

onMounted(() => {
  const currentRoute = useRoute().query.id;
  if (currentRoute) {
    patientID.value = currentRoute as unknown as number;
    searchPatient(patientID.value);
  }
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
        </div>
        <button v-if="!isStarted" @click="startSimulation">
          Rozpocznij symulacje
        </button>
        <button v-else @click="stopSimulation">Zatrzymaj symulacje</button>
        <div class="freq-input">
          Częstotliwość symulacji w milisekundach: {{ freq }}
          <!-- <input type="number" v-model="freq" /> -->
        </div>
        <div>
          Wybierz przypadek:
          <div>
            <button
              @click="
                choosedCase = healthyCase;
                choosedCaseID = 0;
              "
              :class="{ 'button-red': choosedCaseID == 0 }"
            >
              Zdrowy
            </button>
            <button
              @click="
                choosedCase = heartAttackCase1;
                choosedCaseID = 1;
              "
              :class="{ 'button-red': choosedCaseID == 1 }"
            >
              Zawał serca 1
            </button>
            <button
              @click="
                choosedCase = heartAttackCase2;
                choosedCaseID = 2;
              "
              :class="{ 'button-red': choosedCaseID == 2 }"
            >
              Zawał serca 2
            </button>
          </div>
        </div>
        <div>
          <div>Wybierz wykres:</div>
          <button
            @click="showCharts = 0"
            :class="{ 'button-red': showCharts == 0 }"
          >
            ECG
          </button>
          <button
            @click="showCharts = 1"
            :class="{ 'button-red': showCharts == 1 }"
          >
            Pleth
          </button>
          <button
            @click="showCharts = 2"
            :class="{ 'button-red': showCharts == 2 }"
          >
            CO2
          </button>
          <button
            @click="showCharts = 3"
            :class="{ 'button-red': showCharts == 3 }"
          >
            ART
          </button>
          <button
            @click="showCharts = 4"
            :class="{ 'button-red': showCharts == 4 }"
          >
            AWP
          </button>
          <button
            @click="showCharts = 5"
            :class="{ 'button-red': showCharts == 5 }"
          >
            AWF
          </button>
          <button
            @click="showCharts = 6"
            :class="{ 'button-red': showCharts == 6 }"
          >
            AWV
          </button>
        </div>
        <div v-if="patient && patient.diagnosis" class="diagnosis">
          Diagnoza:
          <div
            v-for="(diagnosis, time) in lastDiagnosis"
            :key="time"
            class="stats__grid__value"
          >
            <span
              >{{ dayjs(parseInt(time as unknown as string)).format("DD-MM-YYYY HH:mm:ss") }}</span
            >:
            {{ diagnosis }}
          </div>
        </div>
      </div>

      <div class="stats" v-if="slicedStatus">
        <div class="stats__grid">
          <div v-if="showCharts == 0" class="stats__grid__value">
            <line-chart
              :data="forCharts ? forCharts[0] : {}"
              xtitle="Czas"
              ytitle="ECG"
            >
            </line-chart>
          </div>

          <div v-else-if="showCharts == 1" class="stats__grid__value">
            <line-chart
              :data="forCharts ? forCharts[1] : {}"
              xtitle="Czas"
              ytitle="Pleth"
            ></line-chart>
          </div>

          <div v-else-if="showCharts == 2" class="stats__grid__value">
            <line-chart
              :data="forCharts ? forCharts[2] : {}"
              xtitle="Czas"
              ytitle="CO2"
            ></line-chart>
          </div>

          <div v-else-if="showCharts == 3" class="stats__grid__value">
            <line-chart
              :data="forCharts ? forCharts[3] : {}"
              xtitle="Czas"
              ytitle="ART"
            ></line-chart>
          </div>

          <div v-else-if="showCharts == 4" class="stats__grid__value">
            <line-chart
              :data="forCharts ? forCharts[4] : {}"
              xtitle="Czas"
              ytitle="AWP"
            ></line-chart>
          </div>

          <div v-else-if="showCharts == 5" class="stats__grid__value">
            <line-chart
              :data="forCharts ? forCharts[5] : {}"
              xtitle="Czas"
              ytitle="AWF"
            ></line-chart>
          </div>

          <div v-else-if="showCharts == 6" class="stats__grid__value">
            <line-chart
              :data="forCharts ? forCharts[6] : {}"
              xtitle="Czas"
              ytitle="AWV"
            ></line-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patients-grid {
  display: flex;
  width: 100%;
  margin-top: 50px;
}
.patient {
  width: 25%;
  padding-right: 20px;
}

.stats {
  display: flex;
  flex-flow: wrap column;
  background-color: white;
  width: 75%;

  &__grid {
    width: 100%;
    padding: 20px;
  }
}
.diagnosis {
  margin-top: 20px;
  font-size: 20px;
}
.button-red {
  background-color: red;
  color: white;
}
</style>
