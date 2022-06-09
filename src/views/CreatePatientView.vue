<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createPatient, getPatients } from "@/firebase";
import type { Patient } from "../types/patient";
const form = ref<Patient>({
  id: 0,
  firstName: "",
  lastName: "",
  diagnosis: {},
});
function getAllPatients() {
  getPatients().then((data) => {
    console.log(data);
    form.value.id = Object.entries(data).length;
  });
}
function onSubmit() {
  if (form.value) {
    createPatient(form.value);
    form.value.id++;
    form.value.firstName = "";
    form.value.lastName = "";
  }
}
onMounted(() => {
  getAllPatients();
});
</script>

<template>
  <div class="patients">
    <h1>Dodaj pacjenta</h1>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="form.firstName" placeholder="Imię" />
      <input type="text" v-model="form.lastName" placeholder="Nazwisko" />
      <button type="submit">Dodaj pacjenta</button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
