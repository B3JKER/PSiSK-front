<script setup lang="ts">
import { ref } from "vue";
import slider from "vue3-slider";
import type { Patient } from "../types/patient";

const patient_1 = ref<Patient>({
  id: 1,
  firstName: "Paweł",
  lastName: "Piekarz",
  heartrate: 80,
});
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
          <input type="text" v-model="patient_1.heartrate" />
          <slider
            v-model="patient_1.heartrate"
            color="#FB278D"
            track-color="#FEFEFE"
            max="200"
            width="200px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patients-grid {
  display: grid;
  width: 80%;
}
</style>
