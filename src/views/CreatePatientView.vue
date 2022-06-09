<script setup lang="ts">
import { ref } from "vue";
import { createPatient } from "@/firebase";
import type { Patient } from "../types/patient";
const form = ref<Patient>({
  id: 0,
  firstName: "",
  lastName: "",
  diagnosis: {},
});
const onSubmit = async () => {
  if (form.value) {
    await createPatient(form.value);
    form.value.firstName = "";
    form.value.lastName = "";
  }
};
</script>

<template>
  <div class="patients">
    <h1>Dodaj pacjenta</h1>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="form.id" />
      <input type="text" v-model="form.firstName" placeholder="Imię" />
      <input type="text" v-model="form.lastName" placeholder="Nazwisko" />
      <button type="submit">Dodaj pacjenta</button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
