<script setup lang="ts">
</script>

<template>
  <g class="visual-effects" aria-label="Visual atmosphere">
    <circle cx="545" cy="205" r="18" class="glow" />
    <circle cx="545" cy="205" r="32" class="glow outer" />
    <circle cx="630" cy="470" r="26" class="glow soft" />
  </g>
</template>

<style scoped>
.glow {
  fill: rgba(138, 230, 255, 0.18);
  animation: glowPulse 4s ease-in-out infinite;
}

.outer {
  animation-delay: 0.5s;
}

.soft {
  fill: rgba(126, 206, 154, 0.15);
  animation-delay: 1s;
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.08);
  }
}
</style>
