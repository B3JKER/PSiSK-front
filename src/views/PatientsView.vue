<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Patient } from "../types/patient";
import { getPatients, deletePatient } from "@/firebase";

const patients = ref<Array<Patient>>();
const confirm = ref<Array<boolean>>([]);
const deleting = ref<Array<boolean>>([]);

function getAllPatients() {
  getPatients().then((data) => {
    if (data !== undefined) {
      patients.value = data;
      if (patients.value)
        patients.value.forEach((element) => {
          confirm.value[element.id] = false;
          deleting.value[element.id] = false;
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
    <div v-if="patients" class="patients-grid__title">
      <div>ID Pacjenta</div>
      <div>Imię i nazwisko</div>
      <div>Akcje</div>
    </div>
    <div v-if="patients" class="patients-grid">
      <div v-for="patient in patients" :key="patient.id" class="patient">
        <div>{{ patient.id }}</div>
        <div>{{ patient.firstName }} {{ patient.lastName }}</div>
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
  width: 100%;

  &__title {
    display: grid;
    grid-template-columns: 0.4fr 1fr 0.4fr 0.4fr;
    width: 100%;
    margin: 40px 0;
    padding-top: 20px;
    font-size: 20px;
    font-weight: bold;
    border-top: 1px solid white;
  }
}
.patient {
  display: grid;
  grid-template-columns: 0.4fr 1fr 0.4fr 0.4fr;
  font-size: 20px;
}
button {
  font-size: 20px;
}
</style>
