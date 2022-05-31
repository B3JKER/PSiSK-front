<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Patient } from "../types/patient";
import { getPatients, deletePatient } from "@/firebase";

const patients = ref<Array<Patient>>();
const confirm = ref<Array<boolean>>([]);

function getAllPatients() {
  getPatients().then((data) => {
    if (data !== undefined) {
      patients.value = data;
      if (patients.value)
        patients.value.forEach((element) => {
          confirm.value[element.id] = false;
        });
    } else {
      patients.value = undefined;
    }
  });
}
function deleteAPatient(id: number) {
  deletePatient(id).then(() => {
    getAllPatients();
  });
}
onMounted(() => {
  getAllPatients();
});
</script>

<template>
  <div class="patients">
    <h1>Pacjenci</h1>
    <div v-if="patients" class="patients-grid">
      <div v-for="patient in patients" :key="patient.id" class="patient">
        <div>ID Pacjenta: {{ patient.id }}</div>
        <div>
          Imię i nazwisko: {{ patient.firstName }} {{ patient.lastName }}
        </div>
        <button v-if="!confirm[patient.id]" @click="confirm[patient.id] = true">
          Usuń pacjenta
        </button>
        <button
          v-else
          @click="
            deleteAPatient(patient.id);
            confirm[patient.id] = false;
          "
        >
          Czy napewno?
        </button>
        <button
          @click="
            $router.push({
              path: '/patient-simulation',
              query: { id: patient.id },
            })
          "
        >
          Symulacja
        </button>
      </div>
    </div>
    <div v-else class="loading">Ładowanie listy pacjentów...</div>
  </div>
</template>

<style lang="scss" scoped>
.patients-grid {
  display: grid;
  gap: 2rem;
  width: 80%;
  margin-top: 4rem;
}
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
}
</style>
