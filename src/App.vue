<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/patients">Pacjenci</RouterLink>
        <RouterLink to="/patient-simulation">Symulacja pacjenta</RouterLink>
        <RouterLink to="/create-patient">Dodaj pacjenta</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style>
@import "@/assets/base.css";

#app {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  padding: 2rem;
  overflow-x: hidden;
  font-weight: normal;
}

header {
  height: 5vh;
}

nav {
  width: 100%;
  font-size: 18px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: bold;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--text-color);
}

nav a:first-of-type {
  border: 0;
}
</style>
