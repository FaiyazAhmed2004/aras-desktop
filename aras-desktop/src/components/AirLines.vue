<script setup lang="ts">
</script>

<template>
  <g class="air-lines" aria-label="Air supply routes">
    <g class="fish-tank-air-line">
      <path d="M 850 710 L 850 575 L 480 575 L 480 500" class="air-line" />
      <g class="fish-bubbles">
        <circle cx="520" cy="530" r="6" class="bubble" />
        <circle cx="540" cy="520" r="7" class="bubble" />
        <circle cx="560" cy="510" r="8" class="bubble" />
      </g>
    </g>

    <g class="azolla-air-line">
      <path d="M 850 710 L 882 710 L 1120 710 L 1120 460" class="air-line" />
      <g class="azolla-bubbles">
        <circle cx="1080" cy="490" r="6" class="bubble" />
        <circle cx="1118" cy="520" r="7" class="bubble" />
        <circle cx="1140" cy="550" r="8" class="bubble" />
      </g>
    </g>
  </g>
</template>

<style scoped>
.air-line {
  fill: none;
  stroke: #1a202c;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 14 12;
  animation: air-flow 3s linear infinite;
}

.bubble {
  fill: rgba(140, 219, 255, 0.88);
  stroke: rgba(35, 77, 94, 0.7);
  stroke-width: 1.8;
  animation: bubble-rise 2.8s ease-in-out infinite;
}

.fish-bubbles .bubble:nth-child(2n) {
  animation-delay: 0.5s;
}

.azolla-bubbles .bubble:nth-child(2n) {
  animation-delay: 0.8s;
}

@keyframes air-flow {
  0% {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
  100% {
    stroke-dashoffset: -96;
    opacity: 1;
  }
}

@keyframes bubble-rise {
  0% {
    transform: translateY(8px) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-16px) scale(1.2);
    opacity: 0;
  }
}
</style>
