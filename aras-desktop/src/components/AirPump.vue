<script setup lang="ts">
</script>

<template>
  <g class="air-pump" aria-label="Air pump" transform="translate(640 650)">
    <g class="pump-shell" filter="url(#softShadow)">
      <rect x="0" y="0" width="170" height="110" rx="28" class="pump-body" />
      <rect x="22" y="-26" width="126" height="30" rx="15" class="pump-cap" />
      <circle cx="127" cy="55" r="24" class="pump-motor" />
      <path d="M 127 35 L 127 75 M 107 55 L 147 55" class="pump-spokes" />
      <circle cx="136" cy="26" r="7" class="led-indicator" />
      <path d="M 170 32 H 210" class="pump-port port-left" />
      <path d="M 170 78 H 206" class="pump-port port-right" />
    </g>
  </g>
</template>

<style scoped>
.pump-body {
  fill: #a4b3bb;
  stroke: #1a202c;
  stroke-width: 4;
}

.pump-cap {
  fill: #dfe7ea;
  stroke: #1a202c;
  stroke-width: 3;
}

.pump-motor {
  fill: #c5d6dd;
  stroke: #1a202c;
  stroke-width: 3;
}

.pump-spokes {
  stroke: #1a202c;
  stroke-width: 3;
  fill: none;
}

.led-indicator {
  fill: #71d688;
  stroke: #1a202c;
  stroke-width: 2;
}

.pump-port {
  fill: none;
  stroke: #657d88;
  stroke-width: 8;
  stroke-linecap: round;
}
</style>
