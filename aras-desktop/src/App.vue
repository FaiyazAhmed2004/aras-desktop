<script setup lang="ts">
import TankScene from './components/TankScene.vue';
</script>

<template>
  <main class="app-shell" aria-label="ARAS system overview">
    <TankScene />
  </main>
</template>

<style scoped>
.app-shell {
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}
</style>
